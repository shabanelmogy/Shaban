[CmdletBinding()]
param(
    [string]$DocsRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$WorkspaceRoot = 'F:\My Work\Sigma',
    # Also check the operational digest (skill) against the books.
    [string]$SkillPath = 'F:\My Work\Sigma\.agents\skills\sigma-screen-refactor\SKILL.md',
    [int]$Show = 60
)

# Read-only reference check for the canonical books (Master block 8). It never edits a file.
# Reports, per book file:
#   1. path  - backticked source paths (files and feature folders) that do not exist in the workspace;
#   2. type  - backticked type names (Service, Controller, Policy, Component, ...) that no .cs/.ts declares;
#   3. css   - backticked shared CSS classes (sigma-*) that no stylesheet, template or component uses;
#   4. block - "UI block N" / "backend block N" / "Master block N" references outside the book's range;
#   5. link  - relative markdown links to a missing .md file.
# An unresolved item is a finding to read, not an automatic error: a route or an illustrative
# name can look like a path. Exit code = number of findings in groups path, block and link.

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$skipDirs = @('node_modules', 'bin', 'obj', '.git', 'dist', '.angular', 'out-tsc', 'graphify-out', 'generated')
$repoRoots = @(
    (Join-Path $WorkspaceRoot 'SiGmaAngularFrontEnd'),
    (Join-Path $WorkspaceRoot 'SigmaBackend')
)
# Library types the books name on purpose (PrimeNG, ms-lib); they are not in the workspace source.
$externalTypes = @('DialogService', 'MessageService', 'ConfirmationService', 'DynamicDialogRef', 'TableListComponent')
# Backticked names that look like CSS classes but are not (the skill folder name).
$notCss = @('sigma-screen-refactor')

function Get-Entries([string]$Root) {
    $files = New-Object System.Collections.Generic.List[string]
    $dirs = New-Object System.Collections.Generic.List[string]
    $queue = New-Object System.Collections.Generic.Queue[string]
    $queue.Enqueue($Root)
    while ($queue.Count -gt 0) {
        $dir = $queue.Dequeue()
        foreach ($d in [System.IO.Directory]::GetDirectories($dir)) {
            if ($skipDirs -contains [System.IO.Path]::GetFileName($d)) { continue }
            $dirs.Add($d.Replace('\', '/').ToLowerInvariant())
            $queue.Enqueue($d)
        }
        foreach ($f in [System.IO.Directory]::GetFiles($dir)) { $files.Add($f.Replace('\', '/').ToLowerInvariant()) }
    }
    return @{ Files = $files; Dirs = $dirs }
}

Write-Host 'Indexing the workspace (read-only)...'
$allFiles = New-Object System.Collections.Generic.List[string]
$allDirs = New-Object System.Collections.Generic.List[string]
foreach ($r in $repoRoots) {
    if (-not (Test-Path $r)) { Write-Warning "Missing repository root: $r"; continue }
    $e = Get-Entries $r
    $allFiles.AddRange($e.Files); $allDirs.AddRange($e.Dirs)
}
$dirNames = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($d in $allDirs) { [void]$dirNames.Add([System.IO.Path]::GetFileName($d)) }

# Shared CSS classes and declared type names (class, interface, record, enum) in the source.
$cssClasses = New-Object 'System.Collections.Generic.HashSet[string]'
$typeNames = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($f in $allFiles) {
    $isTs = ($f -match '\.ts$') -and ($f -match '/src/')
    $isCs = $f -match '\.cs$'
    $isStyle = ($f -match '\.(scss|css|html)$') -and ($f -match '/src/')
    if (-not ($isTs -or $isCs -or $isStyle)) { continue }
    $text = [System.IO.File]::ReadAllText($f)
    if ($isTs -or $isStyle) {
        foreach ($m in [regex]::Matches($text, 'sigma-[a-z0-9_-]+')) { [void]$cssClasses.Add($m.Value.ToLowerInvariant()) }
    }
    if ($isTs -or $isCs) {
        foreach ($m in [regex]::Matches($text, '\b(?:class|interface|record|enum)\s+([A-Za-z_]\w*)')) { [void]$typeNames.Add($m.Groups[1].Value) }
    }
}

function Test-PathToken([string]$Token, [string]$MdDir) {
    $t = $Token.Replace('\', '/').TrimStart('.', '/').TrimEnd('/').ToLowerInvariant()
    foreach ($base in @($MdDir, $DocsRoot, $WorkspaceRoot, $PSScriptRoot)) {
        if (Test-Path -LiteralPath (Join-Path $base $Token)) { return $true }
    }
    $suffix = '/' + $t
    foreach ($f in $allFiles) { if ($f.EndsWith($suffix)) { return $true } }
    foreach ($d in $allDirs) { if ($d.EndsWith($suffix)) { return $true } }
    return $false
}

# Block ranges from the book folders.
$ranges = @{}
foreach ($book in @('ui', 'backend', 'master')) {
    $nums = Get-ChildItem -LiteralPath (Join-Path $DocsRoot $book) -Filter '*.md' |
        Where-Object { $_.Name -match '^(\d+)-' } | ForEach-Object { [int]($_.Name -replace '^(\d+)-.*', '$1') }
    $ranges[$book] = ($nums | Measure-Object -Maximum).Maximum
}

$targets = @()
foreach ($book in @('master', 'ui', 'backend')) {
    $targets += Get-ChildItem -LiteralPath (Join-Path $DocsRoot $book) -Filter '*.md' -Recurse
}
if ($SkillPath -and (Test-Path -LiteralPath $SkillPath)) { $targets += Get-Item -LiteralPath $SkillPath }

$findings = New-Object System.Collections.Generic.List[object]
function Add-Finding([string]$Group, [string]$File, [int]$Line, [string]$Text) {
    $findings.Add([pscustomobject]@{ Group = $Group; File = $File; Line = $Line; Text = $Text })
}

$typeSuffix = '(Service|Controller|ControllerBase|Helper|Policy|Profile|Configuration|Resolver|Repository|Component|Directive|Pipe|Guard|Interceptor)'
foreach ($md in $targets) {
    $rel = $md.FullName.Replace($DocsRoot, '').TrimStart('\')
    $lines = [System.IO.File]::ReadAllLines($md.FullName, [System.Text.Encoding]::UTF8)
    $inFence = $false
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        if ($line.TrimStart().StartsWith('```')) { $inFence = -not $inFence; continue }
        if ($inFence) { continue }
        foreach ($m in [regex]::Matches($line, '`([^`]+)`')) {
            $tok = $m.Groups[1].Value.Trim()
            if ($tok -match '[\s*<>{}()|=,;:"]' -or $tok -match '^https?') { continue }
            if ($tok.StartsWith('.') -and $tok -notmatch '^\.sigma-') { continue }
            if (($tok -match '\.(cs|ts|html|scss|css|json|ps1|md)$') -and ($tok -match '[/\\]|\.(cs|ts|html|scss|ps1)$')) {
                if (($tok -match '\.md$') -and ($tok -notmatch '/')) { continue }
                if (-not (Test-PathToken $tok $md.DirectoryName)) { Add-Finding 'path' $rel ($i + 1) $tok }
            }
            elseif ($tok -match '^[A-Za-z][\w.-]*(/[\w.-]+)+/?$') {
                $first = ($tok.TrimStart('/') -split '/')[0].ToLowerInvariant()
                if (-not $dirNames.Contains($first)) { continue }
                if (-not (Test-PathToken $tok $md.DirectoryName)) { Add-Finding 'path' $rel ($i + 1) $tok }
            }
            elseif ($tok -cmatch ('^I?[A-Z][A-Za-z0-9]+' + $typeSuffix + '$')) {
                if (-not $typeNames.Contains($tok) -and $externalTypes -notcontains $tok) { Add-Finding 'type' $rel ($i + 1) $tok }
            }
            elseif ($tok -match '^\.?(sigma-[a-z0-9_-]+)$') {
                $cls = $Matches[1]
                if ($cls.EndsWith('-') -or $notCss -contains $cls) { continue }
                if (-not $cssClasses.Contains($cls)) { Add-Finding 'css' $rel ($i + 1) $tok }
            }
        }
        foreach ($m in [regex]::Matches($line, '\b(UI|[Bb]ackend|BE|Master)\s+(?:block|blocks)?\s*(\d+)\b')) {
            $book = switch -regex ($m.Groups[1].Value) { '^UI$' { 'ui' } '^Master$' { 'master' } default { 'backend' } }
            $n = [int]$m.Groups[2].Value
            if (($m.Groups[1].Value -match '^[Bb]ackend$') -and ($m.Value -notmatch 'block')) { continue }
            if ($n -gt $ranges[$book]) { Add-Finding 'block' $rel ($i + 1) $m.Value }
        }
        foreach ($m in [regex]::Matches($line, '\]\(([^)#\s]+\.md)(#[^)]*)?\)')) {
            $target = $m.Groups[1].Value
            if ($target -match '^https?') { continue }
            if (-not (Test-Path -LiteralPath (Join-Path $md.DirectoryName $target))) { Add-Finding 'link' $rel ($i + 1) $target }
        }
    }
}

$groups = $findings | Group-Object Group
foreach ($g in $groups) {
    Write-Host ''
    Write-Host ("== {0}: {1}" -f $g.Name, $g.Count)
    $g.Group | Select-Object -First $Show | ForEach-Object { Write-Host ("  {0}:{1}  {2}" -f $_.File, $_.Line, $_.Text) }
}
if ($findings.Count -eq 0) { Write-Host 'OK - every checked reference resolves.' }
$hard = @($findings | Where-Object { $_.Group -in @('path', 'block', 'link') }).Count
exit $hard
