[CmdletBinding()]
param(
    [string]$Reviews = 'F:\My Work\Sigma\reviews',
    # Reviews larger than this need a *_CURRENT_STATE.md (Master8).
    [int]$MinBytes = 40960,
    # Keep each generated index under the 4 KB current-state budget.
    [int]$MaxBytes = 3900,
    # Write files; without it the script only reports what it would write.
    [switch]$Apply,
    # Rewrite existing generated indexes too. Written summaries are never touched.
    [switch]$Refresh
)

# Creates a navigation index (status, files, section headings) for every large review that has no
# current-state file (Master8). A generated index is a Draft placeholder: the next round on that
# feature replaces it with a written English summary of at most 4 KB.

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$enc = New-Object Text.UTF8Encoding $false
$generatedMarker = '(generated index)'
$suffix = '_(FULL_STACK_REVIEW|FEATURE_REVIEW|FINAL_RECONCILIATION|RECONCILIATION|MAINTENANCE_EVOLUTION_PLAN|CONTRACT_FREEZE|REVIEW_EVIDENCE|REVIEW)$'
$excluded = '[\\/](Archive|Deferred|evidence)[\\/]'

function Test-Generated([string]$Path) {
    $first = [IO.File]::ReadAllLines($Path, [Text.Encoding]::UTF8) | Select-Object -First 1
    return $first -and $first.Contains($generatedMarker)
}

$existing = @(Get-ChildItem -LiteralPath $Reviews -Recurse -Filter '*_CURRENT_STATE.md' |
    Where-Object { $_.FullName -notmatch $excluded })
$covered = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($cs in $existing) {
    if ($Refresh -and (Test-Generated $cs.FullName)) { continue }
    foreach ($m in [regex]::Matches([IO.File]::ReadAllText($cs.FullName), '\(<?([^)>#]+\.md)')) {
        [void]$covered.Add([IO.Path]::GetFileName($m.Groups[1].Value).ToLowerInvariant())
    }
}

# A generated index whose full files are all covered by written summaries is redundant.
if ($Refresh) {
    foreach ($cs in $existing | Where-Object { Test-Generated $_.FullName }) {
        $links = @([regex]::Matches([IO.File]::ReadAllText($cs.FullName), '(?m)^\| Full file \| \[([^\]]+\.md)\]') |
            ForEach-Object { $_.Groups[1].Value.ToLowerInvariant() })
        if ($links.Count -gt 0 -and @($links | Where-Object { -not $covered.Contains($_) }).Count -eq 0) {
            Write-Host "redundant generated index (covered by a written summary): $($cs.FullName.Replace($Reviews + '\', ''))"
            if ($Apply) { Remove-Item -LiteralPath $cs.FullName }
        }
    }
}

$large = Get-ChildItem -LiteralPath $Reviews -Recurse -Filter '*.md' | Where-Object {
    $_.FullName -notmatch $excluded -and
    $_.Name -notmatch '^(INDEX|INDEX_HISTORY)\.md$|_CURRENT_STATE\.md$' -and
    $_.Length -gt $MinBytes -and
    -not $covered.Contains($_.Name.ToLowerInvariant())
}
$groups = $large | Group-Object { $_.DirectoryName + '|' + ([regex]::Replace($_.BaseName, $suffix, '')) }

$made = 0
foreach ($g in $groups) {
    $dir, $key = $g.Name.Split('|')
    $target = Join-Path $dir ($key + '_CURRENT_STATE.md')
    if ((Test-Path -LiteralPath $target) -and -not ($Refresh -and (Test-Generated $target))) {
        Write-Host "skip written summary $target"
        continue
    }

    $files = @($g.Group | Sort-Object Length -Descending)
    $main = $files[0]
    $text = [IO.File]::ReadAllText($main.FullName, [Text.Encoding]::UTF8)
    $recorded = ([regex]::Match($text, '(?m)^\|\s*Status\s*\|\s*([^|\r\n]+?)\s*\|')).Groups[1].Value
    if (-not $recorded) { $recorded = 'not recorded' }
    $dates = @([regex]::Matches($text, '20\d\d-[01]\d-[0-3]\d') | ForEach-Object Value | Sort-Object -Unique)
    $last = if ($dates.Count -gt 0) { $dates[-1] } else { 'not recorded' }

    $out = @(
        ("# $key " + [char]0x2014 + " current state $generatedMarker"), '',
        '| Item | Value |', '|---|---|',
        '| Status | Draft |',
        '| Owner verification pending | no |',
        '| Kind | Generated navigation index, not a written summary (Master8) |',
        "| Status recorded in the full file | $recorded |",
        "| Latest date found | $last |")
    foreach ($f in $files) { $out += "| Full file | [$($f.Name)]($($f.Name)) ($([math]::Round($f.Length / 1KB)) KB) |" }
    $out += ''
    $out += 'Read the needed section of the full file by heading. When this feature is next touched,'
    $out += 'replace this file with a written English summary of at most 4 KB.'

    $siblings = @(Get-ChildItem -LiteralPath $dir -File -Filter ($key + '_*') |
        Where-Object { $_.Name -notmatch '_CURRENT_STATE\.md$' -and ($files.Name -notcontains $_.Name) } |
        Select-Object -First 10)
    if ($siblings.Count -gt 0) {
        $out += ''; $out += '## Related files'; $out += ''
        foreach ($s in $siblings) { $out += "- [$($s.Name)]($($s.Name))" }
    }
    $out += ''; $out += "## Sections of $($main.Name)"; $out += ''

    $heads = @([regex]::Matches($text, '(?m)^## (.+?)\s*$') | ForEach-Object { $_.Groups[1].Value })
    $body = ($out -join "`n")
    $shown = 0
    foreach ($h in $heads) {
        $line = "- $h"
        if ([Text.Encoding]::UTF8.GetByteCount($body + "`n" + $line) -gt ($MaxBytes - 80)) { break }
        $body += "`n" + $line
        $shown++
    }
    if ($shown -lt $heads.Count) { $body += "`n- ... $($heads.Count - $shown) more; list with a heading search." }

    $made++
    Write-Host ("{0,5} B  {1}  ({2} files, {3}/{4} headings)" -f [Text.Encoding]::UTF8.GetByteCount($body),
        $target.Replace($Reviews + '\', ''), $files.Count, $shown, $heads.Count)
    if ($Apply) { [IO.File]::WriteAllText($target, $body + "`n", $enc) }
}
Write-Host "indexes=$made (Apply=$([bool]$Apply), Refresh=$([bool]$Refresh))"
