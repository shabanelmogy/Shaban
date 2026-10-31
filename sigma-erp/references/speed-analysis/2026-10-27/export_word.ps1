$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$wordApp = $null
$document = $null
try {
    $wordApp = New-Object -ComObject Word.Application
    $wordApp.Visible = $false
    $wordApp.DisplayAlerts = 0
    $document = $wordApp.Documents.Open((Join-Path $taskRoot 'Speed_Analysis_Guide.docx'), $false, $true)
    $document.Repaginate()
    $pageCount = $document.ComputeStatistics(2)
    $document.ExportAsFixedFormat((Join-Path $taskRoot 'qa\Speed_Analysis_Guide.pdf'), 17)
    [pscustomobject]@{Pages=$pageCount; Pdf=(Join-Path $taskRoot 'qa\Speed_Analysis_Guide.pdf')} | ConvertTo-Json -Compress
}
finally {
    if ($null -ne $document) { $document.Close(0); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($document) }
    if ($null -ne $wordApp) { $wordApp.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($wordApp) }
}
