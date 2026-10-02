[CmdletBinding()]
param(
    [string]$VocabRoot = 'F:\My Work\Sigma\SiGmaAngularFrontEnd\src\app\modules\i18n\vocabs',
    # Limit the report to keys under these top-level blocks (for example: job,general). Empty = all.
    [string[]]$Block = @(),
    [int]$Show = 40
)

# Read-only en/ar translation parity check (UI block 23). It never edits a file.
# Reports: keys missing from ar.ts, keys missing from en.ts, and keys that differ only by case.
# The parser is line based (2-space layout); several "key: 'value'" pairs on one line are read too.

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-TranslationKeys([string]$Path) {
    $keys = New-Object System.Collections.Generic.List[string]
    $stack = New-Object System.Collections.Generic.List[object]
    $pattern = '^(?<indent>\s*)(?:(?<q>[''"])(?<qkey>.+?)\k<q>|(?<key>[A-Za-z_$][\w$]*))\s*:\s*(?<rest>.*)$'
    foreach ($line in [System.IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8)) {
        $m = [regex]::Match($line, $pattern)
        if (-not $m.Success) { continue }
        $indent = $m.Groups['indent'].Value.Length
        $name = if ($m.Groups['qkey'].Success) { $m.Groups['qkey'].Value } else { $m.Groups['key'].Value }
        $rest = $m.Groups['rest'].Value.Trim()
        while ($stack.Count -gt 0 -and $stack[$stack.Count - 1].Indent -ge $indent) { $stack.RemoveAt($stack.Count - 1) }
        # Skip the export wrapper (`locale: { lang: 'en', data: { ... } }`).
        $keyPath = @($stack | ForEach-Object { $_.Name }) + $name
        if ($rest.StartsWith('{') -and -not $rest.EndsWith('},') -and -not $rest.EndsWith('}')) {
            $stack.Add([pscustomobject]@{ Indent = $indent; Name = $name })
        }
        elseif ($rest -match '^[''"`]') {
            $keys.Add(($keyPath -join '.'))
            # More keys on the same line: "a: 'x', b: 'y'" (the Job blocks use this layout).
            $prefix = @($stack | ForEach-Object { $_.Name })
            foreach ($more in [regex]::Matches($rest, ',\s*(?:(?<q>[''"])(?<qkey>.+?)\k<q>|(?<key>[A-Za-z_$][\w$]*))\s*:\s*[''"`]')) {
                $extra = if ($more.Groups['qkey'].Success) { $more.Groups['qkey'].Value } else { $more.Groups['key'].Value }
                $keys.Add((($prefix + $extra) -join '.'))
            }
        }
    }
    # Drop the wrapper segments before the first real block (`locale.data.`).
    return $keys | ForEach-Object { $_ -replace '^(locale\.)?data\.', '' }
}

$en = @(Get-TranslationKeys (Join-Path $VocabRoot 'en.ts'))
$ar = @(Get-TranslationKeys (Join-Path $VocabRoot 'ar.ts'))

if ($Block.Count -gt 0) {
    $inBlock = { param($key) @($Block | Where-Object { $key -eq $_ -or $key.StartsWith($_ + '.') }).Count -gt 0 }
    $en = @($en | Where-Object { & $inBlock $_ })
    $ar = @($ar | Where-Object { & $inBlock $_ })
}

$enSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$en)
$arSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$ar)
$arFold = @{}
foreach ($k in $ar) { $arFold[$k.ToLowerInvariant()] = $k }

$missingAr = @($en | Where-Object { -not $arSet.Contains($_) } | Sort-Object -Unique)
$missingEn = @($ar | Where-Object { -not $enSet.Contains($_) } | Sort-Object -Unique)
$caseOnly = @($missingAr | Where-Object { $arFold.ContainsKey($_.ToLowerInvariant()) } |
    ForEach-Object { "$_  (ar: $($arFold[$_.ToLowerInvariant()]))" })

"en keys: $($en.Count)   ar keys: $($ar.Count)"
"Missing in ar.ts (falls back to English): $($missingAr.Count)"
$missingAr | Select-Object -First $Show | ForEach-Object { "  $_" }
"Missing in en.ts (raw key in English - severe): $($missingEn.Count)"
$missingEn | Select-Object -First $Show | ForEach-Object { "  $_" }
"Case-only differences: $($caseOnly.Count)"
$caseOnly | Select-Object -First $Show | ForEach-Object { "  $_" }
