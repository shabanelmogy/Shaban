param([Parameter(Mandatory=$true)][System.Management.Automation.PSCredential]$Credential)
$ErrorActionPreference = 'Stop'
$analysisRoot = Split-Path -Parent $PSScriptRoot
$origin = 'https://app.speedautosystems.com'
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$null = Invoke-WebRequest -Uri "$origin/" -WebSession $session -UseBasicParsing
$loginBody = @{ usernameOrEmailAddress=$Credential.UserName; password=$Credential.GetNetworkCredential().Password; isNewMethod='true'; tenancyName=''; returnUrlHash='' }
$login = Invoke-WebRequest -Uri "$origin/Account/LoginNew?returnUrl=/Application" -Method Post -Body $loginBody -WebSession $session -Headers @{ 'X-Requested-With'='XMLHttpRequest' } -UseBasicParsing
$loginBody.Clear()
$loginResult = $login.Content | ConvertFrom-Json
if (-not $loginResult.success) { throw 'Login failed. No credential or response content was written.' }
$page = Invoke-WebRequest -Uri "$origin/Application" -WebSession $session -UseBasicParsing
$scriptUrls = @([regex]::Matches($page.Content, '<script\b[^>]*\bsrc\s*=\s*["'']([^"'']+)["''][^>]*>', 'IgnoreCase') | ForEach-Object { [System.Net.WebUtility]::HtmlDecode($_.Groups[1].Value) })
$selected = @(
    @{match='/Bundles/App/js?';name='application.js'},
    @{match='/Bundles/Common/js?';name='common.js'},
    @{match='/Bundles/App/libs/js?';name='libraries.js'},
    @{match='/Bundles/App/metronic/js?';name='metronic.js'},
    @{match='/api/AbpServiceProxies/GetAll?type=angular';name='service-proxies-angular.js'},
    @{match='/api/AbpServiceProxies/GetAll?v=';name='service-proxies-jquery.js'}
)
$manifest = @()
foreach ($asset in $selected) {
    $url = $scriptUrls | Where-Object { $_.StartsWith($asset.match) } | Select-Object -First 1
    if (-not $url) { throw "Declared asset not found: $($asset.name)" }
    $uri = [Uri]::new([Uri]$origin, $url).AbsoluteUri
    $path = Join-Path $analysisRoot ('raw\'+$asset.name)
    if (Test-Path -LiteralPath $path) { throw "Refusing to overwrite original snapshot: $path" }
    $response = Invoke-WebRequest -Uri $uri -WebSession $session -UseBasicParsing
    [IO.File]::WriteAllText($path, $response.Content, [Text.UTF8Encoding]::new($false))
    $manifest += [pscustomobject]@{file=('raw/'+$asset.name);url=$uri;status=[int]$response.StatusCode;contentType=[string]$response.Headers['Content-Type'];representation='decoded HTTP text saved as UTF-8 without BOM';bytes=(Get-Item -LiteralPath $path).Length;sha256=(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLower();capturedAtUtc=[DateTime]::UtcNow.ToString('o')}
}
$loginJsPath = Join-Path $analysisRoot 'raw\login.js'
$response = Invoke-WebRequest -Uri "$origin/Views/Account/Login.js" -WebSession $session -UseBasicParsing
[IO.File]::WriteAllText($loginJsPath, $response.Content, [Text.UTF8Encoding]::new($false))
$manifest += [pscustomobject]@{file='raw/login.js';url="$origin/Views/Account/Login.js";status=[int]$response.StatusCode;contentType=[string]$response.Headers['Content-Type'];representation='decoded HTTP text saved as UTF-8 without BOM';bytes=(Get-Item -LiteralPath $loginJsPath).Length;sha256=(Get-FileHash -LiteralPath $loginJsPath -Algorithm SHA256).Hash.ToLower();capturedAtUtc=[DateTime]::UtcNow.ToString('o')}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $analysisRoot 'data\asset-manifest.json') -Encoding UTF8
$session = $null
$Credential = $null
$manifest | Select-Object file,bytes,status
# No cookies, passwords, account bootstrap configuration or business record responses are saved.
