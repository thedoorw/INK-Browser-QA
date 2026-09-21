$ErrorActionPreference = 'Stop'

param(
  [string]$BaseUrl = 'http://127.0.0.1:4173'
)

$BaseUrl = $BaseUrl.TrimEnd('/')
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$SiteRoot = (Resolve-Path (Join-Path $RepoRoot 'product\source')).Path

Write-Host ""
Write-Host "INK local runtime preflight" -ForegroundColor Cyan
Write-Host "PowerShell : $($PSVersionTable.PSVersion)"
Write-Host "Repo       : $RepoRoot"
Write-Host "Site       : $SiteRoot"
Write-Host "URL        : $BaseUrl"
Write-Host ""

if ($PSVersionTable.PSVersion.Major -lt 5) {
  throw "PowerShell 5.1 or newer is required."
}

$RequiredLocal = @(
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'service-worker.js',
  'src\ink.js',
  'src\config.js',
  'src\editor\creative-workspace.js',
  'src\ai\chat-runtime.js',
  'src\extraction\structure.js'
)

$Missing = @()
foreach ($Relative in $RequiredLocal) {
  $Path = Join-Path $SiteRoot $Relative
  if (-not (Test-Path $Path -PathType Leaf)) { $Missing += $Relative }
}
if ($Missing.Count) {
  throw "Missing required local files: $($Missing -join ', ')"
}
Write-Host "[PASS] Required local web files exist" -ForegroundColor Green

$Checks = @(
  @{ Path = '/'; Expected = 'text/html' },
  @{ Path = '/styles.css'; Expected = 'text/css' },
  @{ Path = '/src/ink.js'; Expected = 'javascript' },
  @{ Path = '/src/editor/creative-workspace.js'; Expected = 'javascript' },
  @{ Path = '/src/ai/chat-runtime.js'; Expected = 'javascript' },
  @{ Path = '/manifest.webmanifest'; Expected = 'application/manifest+json' },
  @{ Path = '/service-worker.js'; Expected = 'javascript' }
)

foreach ($Check in $Checks) {
  $Uri = "$BaseUrl$($Check.Path)"
  try {
    $Response = Invoke-WebRequest -Uri $Uri -Method Get -UseBasicParsing -TimeoutSec 10
  } catch {
    throw "HTTP preflight failed for $Uri. Start the local server first. $($_.Exception.Message)"
  }
  $Type = [string]$Response.Headers['Content-Type']
  if ($Response.StatusCode -ne 200) {
    throw "$Uri returned HTTP $($Response.StatusCode)"
  }
  if ($Type -notmatch [regex]::Escape($Check.Expected)) {
    throw "$Uri returned unexpected Content-Type '$Type' (expected to contain '$($Check.Expected)')"
  }
  Write-Host "[PASS] $($Check.Path) -> $($Response.StatusCode) $Type" -ForegroundColor Green
}

$ChromeCandidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe')
)
if (${env:ProgramFiles(x86)}) {
  $ChromeCandidates += (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe')
  $ChromeCandidates += (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe')
}
$ChromeCandidates = $ChromeCandidates | Where-Object { $_ -and (Test-Path $_) }

if ($ChromeCandidates.Count) {
  Write-Host "[PASS] Chromium browser found: $($ChromeCandidates[0])" -ForegroundColor Green
} else {
  Write-Host "[WARN] Chrome/Edge executable was not found in standard locations. A Chromium-compatible browser can still be opened manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PRECHECK = PASS" -ForegroundColor Green
Write-Host "Next: open $BaseUrl and perform the INK-CLOUD-018 browser QA runbook."
