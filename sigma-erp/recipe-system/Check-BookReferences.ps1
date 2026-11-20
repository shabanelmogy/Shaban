[CmdletBinding()]
param(
    # Empty = parent of this script's folder (resolved below; $PSScriptRoot can be empty in
    # Windows PowerShell 5.1 parameter defaults under `powershell -File`).
    [string]$DocsRoot = '',
    [string]$WorkspaceRoot = 'F:\My Work\Sigma',
    # Also check the operational digest (skill) against the books.
    [string]$SkillPath = 'F:\My Work\Sigma\.agents\skills\sigma-screen-refactor\SKILL.md',
    # No application traversal by default. Supply only the feature paths in the current task.
    [string[]]$SourceScope = @(),
    [int]$Show = 60
)

# Read-only reference check for the canonical books (Master block 8). It never edits a file.
# Without SourceScope, only documentation links and block references are checked.
# Source paths/types/styles require explicitly supplied feature paths; no whole-repository scan.
# Reports, per book file:
#   1. path  - backticked source paths (files and feature folders) that do not exist in the workspace;
#   2. type  - backticked type names (Service, Controller, Policy, Component, ...) that no .cs/.ts declares;
#   3. css   - backticked shared CSS classes (sigma-*) that no stylesheet, template or component uses;
#   4. block - "UI block N" / "backend block N" / "Master block N" references outside the book's range;
#   5. link  - a missing local Markdown file, directory link or heading fragment.
# Instruction files (AGENTS.md, live companion and its workflow sections, skill, review index) also get:
#   6. budget    - file larger than its Master8 size budget;
#   7. table     - markdown table whose second line is not the |---| separator;
#   8. duplicate - the same long paragraph in more than one instruction file (one rule, one owner);
#   9. size      - warning only: canonical block over 30 KB (current-state files are budgeted at 4 KB).
#  10. status    - a *_CURRENT_STATE.md without an allowed Status row or Owner verification pending row;
# An unresolved item is a finding to read, not an automatic error: a route or an illustrative
# name can look like a path. Exit code = number of findings in groups path, block, link, budget, table and status.

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $DocsRoot) { $DocsRoot = Split-Path -Parent $ScriptDir }

# Instruction files and their size budgets in bytes (Master8).
$companion = Join-Path $WorkspaceRoot '.agents\SIGMA_WORKFLOW_RULES.md'
$budgets = [ordered]@{}
$budgets[(Join-Path $WorkspaceRoot 'AGENTS.md')] = 8KB
$budgets[$companion] = 14KB
$budgets[$SkillPath] = 15KB
$budgets[(Join-Path $WorkspaceRoot 'reviews\INDEX.md')] = 12KB
$workflowDir = Join-Path $WorkspaceRoot '.agents\workflow'
if (Test-Path -LiteralPath $workflowDir) {
    foreach ($f in Get-ChildItem -LiteralPath $workflowDir -Filter '*.md') { $budgets[$f.FullName] = 12KB }
}
$reviewsDir = Join-Path $WorkspaceRoot 'reviews'
$currentStates = @()
if (Test-Path -LiteralPath $reviewsDir) {
    $currentStates = @(Get-ChildItem -LiteralPath $reviewsDir -Filter '*_CURRENT_STATE.md' -Recurse |
        Where-Object { $_.FullName -notmatch '\\Archive\\' })
    foreach ($f in $currentStates) { $budgets[$f.FullName] = 4KB }
}
# Soft size warning (Master8): canonical blocks over 30 KB.
$blockWarnBytes = 30KB

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

Write-Host 'Checking documentation references (read-only)...'
$allFiles = New-Object System.Collections.Generic.List[string]
$allDirs = New-Object System.Collections.Generic.List[string]
foreach ($scopePath in $SourceScope) {
    $resolvedScope = (Resolve-Path -LiteralPath $scopePath -ErrorAction Stop).Path
    $allowedScope = $false
    foreach ($repoRoot in $repoRoots) {
        $resolvedRepo = [System.IO.Path]::GetFullPath($repoRoot).TrimEnd('\')
        if ($resolvedScope.StartsWith($resolvedRepo + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
            $allowedScope = $true
        }
    }
    if (-not $allowedScope) { throw "SourceScope must be a feature path inside an application repository, not a repository root: $scopePath" }
    if ((Get-Item -LiteralPath $resolvedScope).PSIsContainer) {
        $e = Get-Entries $resolvedScope
        $allFiles.AddRange($e.Files); $allDirs.AddRange($e.Dirs)
    } else {
        $allFiles.Add($resolvedScope.Replace('\', '/').ToLowerInvariant())
    }
}
$checkSource = $SourceScope.Count -gt 0
if (-not $checkSource) { Write-Host 'Application paths/types/styles: not checked (no SourceScope supplied).' }
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
    foreach ($base in @($MdDir, $DocsRoot, $WorkspaceRoot, $ScriptDir)) {
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
foreach ($entry in @('README.md', 'SIGMA_FEATURE_REVIEW_MASTER.md', 'SIGMA_UI_PATTERNS.md',
                     'SIGMA_BACKEND_PATTERNS.md', 'SIGMA_COMMAND_REFERENCE_AR.md', 'recipe-system/README.md')) {
    $targets += Get-Item -LiteralPath (Join-Path $DocsRoot $entry)
}
# Instruction files: skill, entry, companion and its sections are link/block-checked like the books.
foreach ($p in $budgets.Keys) {
    if ($p -and (Test-Path -LiteralPath $p)) { $targets += Get-Item -LiteralPath $p }
}

$findings = New-Object System.Collections.Generic.List[object]
function Add-Finding([string]$Group, [string]$File, [int]$Line, [string]$Text) {
    $findings.Add([pscustomobject]@{ Group = $Group; File = $File; Line = $Line; Text = $Text })
}

$typeSuffix = '(Service|Controller|ControllerBase|Helper|Policy|Profile|Configuration|Resolver|Repository|Component|Directive|Pipe|Guard|Interceptor)'
$anchorsByFile = @{}
function Get-MarkdownAnchors([string]$Path) {
    if (!$anchorsByFile.ContainsKey($Path)) {
        $anchors = New-Object 'System.Collections.Generic.HashSet[string]'
        $fence = $null
        foreach ($line in [System.IO.File]::ReadLines($Path)) {
            if ($fence) {
                if ($line -match ('^ {0,3}' + $fence + $fence[0] + '*\s*$')) { $fence = $null }
                continue
            }
            if ($line -match '^ {0,3}(\x60{3,}|~{3,})') { $fence = $Matches[1]; continue }
            foreach ($id in [regex]::Matches($line, '(?i)<a\s+[^>]*?(?:id|name)=["'']([^"'']+)["'']')) {
                [void]$anchors.Add($id.Groups[1].Value)
            }
            if ($line -notmatch '^ {0,3}#{1,6}\s+(.+?)\s*$') { continue }
            $heading = $Matches[1] -replace '\s+#+$', '' -replace '\[([^\]]+)\]\([^)]+\)', '$1' -replace '<[^>]+>', ''
            $slug = ($heading.ToLowerInvariant() -replace '[^\p{L}\p{M}\p{N}_ -]', '') -replace ' ', '-'
            $candidate = $slug
            for ($suffix = 1; !$anchors.Add($candidate); $suffix++) { $candidate = "$slug-$suffix" }
        }
        $anchorsByFile[$Path] = $anchors
    }
    return ,$anchorsByFile[$Path]
}
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
            if ($checkSource -and ($tok -match '\.(cs|ts|html|scss|css|json|ps1|md)$') -and ($tok -match '[/\\]|\.(cs|ts|html|scss|ps1)$')) {
                if (($tok -match '\.md$') -and ($tok -notmatch '/')) { continue }
                if (-not (Test-PathToken $tok $md.DirectoryName)) { Add-Finding 'path' $rel ($i + 1) $tok }
            }
            elseif ($checkSource -and $tok -match '^[A-Za-z][\w.-]*(/[\w.-]+)+/?$') {
                $first = ($tok.TrimStart('/') -split '/')[0].ToLowerInvariant()
                if (-not $dirNames.Contains($first)) { continue }
                if (-not (Test-PathToken $tok $md.DirectoryName)) { Add-Finding 'path' $rel ($i + 1) $tok }
            }
            elseif ($checkSource -and $tok -cmatch ('^I?[A-Z][A-Za-z0-9]+' + $typeSuffix + '$')) {
                if (-not $typeNames.Contains($tok) -and $externalTypes -notcontains $tok) { Add-Finding 'type' $rel ($i + 1) $tok }
            }
            elseif ($checkSource -and $tok -match '^\.?(sigma-[a-z0-9_-]+)$') {
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
        foreach ($m in [regex]::Matches($line, '\]\((?:<(?<url>[^>]+)>|(?<url>[^)\s]+))\)')) {
            $url = $m.Groups['url'].Value
            if ($url -match '^(?:[a-z][a-z0-9+.-]*://|mailto:|//)') { continue }
            $parts = $url -split '#', 2
            $target = [uri]::UnescapeDataString($parts[0])
            if ($target -and $target -notmatch '(?:\.md|/)$') { continue }
            $targetPath = if (!$target) { $md.FullName } elseif ([System.IO.Path]::IsPathRooted($target)) { $target } else { Join-Path $md.DirectoryName $target }
            if (-not (Test-Path -LiteralPath $targetPath)) {
                Add-Finding 'link' $rel ($i + 1) $url
            } elseif ($parts.Count -eq 2 -and $parts[1] -and $targetPath -match '\.md$') {
                if ([System.IO.Path]::GetFileName($targetPath) -in @('SIGMA_FRONTEND_REVIEW_GUIDE.md', 'SIGMA_BACKEND_REVIEW_GUIDE.md')) {
                    Add-Finding 'link' $rel ($i + 1) $url
                } elseif (!(Get-MarkdownAnchors ([System.IO.Path]::GetFullPath($targetPath))).Contains([uri]::UnescapeDataString($parts[1]))) {
                    Add-Finding 'link' $rel ($i + 1) $url
                }
            }
        }
    }
}

# 6-8. Instruction-file budgets, table structure and repeated paragraphs.
$paragraphOwners = @{}
foreach ($p in $budgets.Keys) {
    if (-not $p -or -not (Test-Path -LiteralPath $p)) { continue }
    $name = $p.Replace($WorkspaceRoot, '').TrimStart('\')
    $size = (Get-Item -LiteralPath $p).Length
    if ($size -gt $budgets[$p]) { Add-Finding 'budget' $name 0 ("{0} bytes > budget {1}" -f $size, $budgets[$p]) }

    $lines = [System.IO.File]::ReadAllLines($p, [System.Text.Encoding]::UTF8)
    $inFence = $false
    $para = New-Object System.Collections.Generic.List[string]
    for ($i = 0; $i -le $lines.Length; $i++) {
        $line = if ($i -lt $lines.Length) { $lines[$i] } else { '' }
        if ($line.TrimStart().StartsWith('```')) { $inFence = -not $inFence; continue }
        if ($inFence) { continue }
        $isRow = $line.TrimStart().StartsWith('|')
        $prevRow = ($i -gt 0) -and $lines[$i - 1].TrimStart().StartsWith('|')
        if ($isRow -and -not $prevRow) {
            $next = if ($i + 1 -lt $lines.Length) { $lines[$i + 1].Trim() } else { '' }
            if ($next -notmatch '^\|(\s*:?-{3,}:?\s*\|)+$') { Add-Finding 'table' $name ($i + 1) 'table header is not followed by a |---| separator' }
        }
        if ($line.Trim() -eq '' -or $isRow -or $line.TrimStart().StartsWith('#')) {
            $text = (($para -join ' ') -replace '\s+', ' ').Trim()
            if ($text.Length -ge 160 -and $name -notmatch '_CURRENT_STATE.md$') {
                if (-not $paragraphOwners.ContainsKey($text)) { $paragraphOwners[$text] = New-Object System.Collections.Generic.List[string] }
                if (-not $paragraphOwners[$text].Contains($name)) { $paragraphOwners[$text].Add($name) }
            }
            $para.Clear()
        } else { $para.Add($line) }
    }
}
# 10. Every current-state file starts with the Master4/artifact status table (allowed values only).
$statusValues = 'Draft|Frozen|Blocked|Implemented ' + [char]0x2014 + ' source-only|Closed'
foreach ($cs in $currentStates) {
    $csText = [System.IO.File]::ReadAllText($cs.FullName, [System.Text.Encoding]::UTF8)
    $csName = 'reviews\' + $cs.FullName.Substring($reviewsDir.Length).TrimStart('\')
    if ($csText -notmatch ('(?m)^\|\s*Status\s*\|\s*(' + $statusValues + ')\s*\|')) {
        Add-Finding 'status' $csName 0 'missing a Status row with an allowed value'
    }
    if ($csText -notmatch '(?m)^\|\s*Owner verification pending\s*\|\s*(yes|no)\s*\|') {
        Add-Finding 'status' $csName 0 'missing an Owner verification pending row (yes/no)'
    }
}

foreach ($book in @('master', 'ui', 'backend')) {
    foreach ($f in Get-ChildItem -LiteralPath (Join-Path $DocsRoot $book) -Filter '*.md' -Recurse) {
        if ($f.Length -gt $blockWarnBytes) { Add-Finding 'size' ($book + '\' + $f.Name) 0 ("{0} bytes > {1}; split or remove history (Master8)" -f $f.Length, $blockWarnBytes) }
    }
}

foreach ($k in $paragraphOwners.Keys) {
    if ($paragraphOwners[$k].Count -gt 1) {
        Add-Finding 'duplicate' ($paragraphOwners[$k] -join ' + ') 0 ($k.Substring(0, [Math]::Min(90, $k.Length)) + '...')
    }
}

$groups = $findings | Group-Object Group
foreach ($g in $groups) {
    Write-Host ''
    Write-Host ("== {0}: {1}" -f $g.Name, $g.Count)
    $g.Group | Select-Object -First $Show | ForEach-Object { Write-Host ("  {0}:{1}  {2}" -f $_.File, $_.Line, $_.Text) }
}
if ($findings.Count -eq 0) { Write-Host 'OK - every checked reference resolves.' }
$hard = @($findings | Where-Object { $_.Group -in @('path', 'block', 'link', 'budget', 'table', 'status') }).Count
exit $hard
