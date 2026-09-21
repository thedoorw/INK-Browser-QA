param(
  [int]$Port = 4173,
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$SiteRoot = (Resolve-Path (Join-Path $RepoRoot 'product\source')).Path
$Url = "http://127.0.0.1:$Port/"

function Get-MimeType([string]$Path) {
  switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8'; break }
    '.htm' { 'text/html; charset=utf-8'; break }
    '.js' { 'text/javascript; charset=utf-8'; break }
    '.mjs' { 'text/javascript; charset=utf-8'; break }
    '.css' { 'text/css; charset=utf-8'; break }
    '.json' { 'application/json; charset=utf-8'; break }
    '.webmanifest' { 'application/manifest+json; charset=utf-8'; break }
    '.svg' { 'image/svg+xml'; break }
    '.png' { 'image/png'; break }
    '.jpg' { 'image/jpeg'; break }
    '.jpeg' { 'image/jpeg'; break }
    '.gif' { 'image/gif'; break }
    '.webp' { 'image/webp'; break }
    '.ico' { 'image/x-icon'; break }
    '.wasm' { 'application/wasm'; break }
    default { 'application/octet-stream' }
  }
}

function Write-Response($Client, [int]$Status, [string]$StatusText, [byte[]]$Body, [string]$ContentType, [bool]$HeadOnly = $false) {
  $Stream = $Client.GetStream()
  $Header = "HTTP/1.1 $Status $StatusText`r`n" +
            "Content-Type: $ContentType`r`n" +
            "Content-Length: $($Body.Length)`r`n" +
            "Cache-Control: no-store`r`n" +
            "X-Content-Type-Options: nosniff`r`n" +
            "Connection: close`r`n`r`n"
  $HeaderBytes = [Text.Encoding]::ASCII.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  if (-not $HeadOnly -and $Body.Length) {
    $Stream.Write($Body, 0, $Body.Length)
  }
  $Stream.Flush()
}

if (-not (Test-Path (Join-Path $SiteRoot 'index.html'))) {
  throw "INK static entry not found: $SiteRoot\index.html"
}

$Listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
try {
  $Listener.Start()
} catch {
  throw "Cannot listen on 127.0.0.1:$Port. Choose another port, e.g. .\qa\runtime\start-ink-local.ps1 -Port 4174"
}

Write-Host ""
Write-Host "INK local web runtime" -ForegroundColor Cyan
Write-Host "Root : $SiteRoot"
Write-Host "URL  : $Url"
Write-Host "Stop : Ctrl+C"
Write-Host ""
Write-Host "This server binds to 127.0.0.1 only and requires no external service." -ForegroundColor DarkGray

if (-not $NoBrowser) {
  Start-Process $Url
}

try {
  while ($true) {
    $Client = $Listener.AcceptTcpClient()
    try {
      $Stream = $Client.GetStream()
      $Reader = [IO.StreamReader]::new($Stream, [Text.Encoding]::ASCII, $false, 4096, $true)
      $RequestLine = $Reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($RequestLine)) {
        $Client.Close()
        continue
      }

      while ($true) {
        $Line = $Reader.ReadLine()
        if ($null -eq $Line -or $Line -eq '') { break }
      }

      $Parts = $RequestLine.Split(' ')
      if ($Parts.Count -lt 2) {
        $Body = [Text.Encoding]::UTF8.GetBytes('Bad Request')
        Write-Response $Client 400 'Bad Request' $Body 'text/plain; charset=utf-8'
        continue
      }

      $Method = $Parts[0].ToUpperInvariant()
      $RawPath = ($Parts[1] -split '\?')[0]
      if ($Method -notin @('GET','HEAD')) {
        $Body = [Text.Encoding]::UTF8.GetBytes('Method Not Allowed')
        Write-Response $Client 405 'Method Not Allowed' $Body 'text/plain; charset=utf-8'
        continue
      }

      $Decoded = [Uri]::UnescapeDataString($RawPath).Replace('/', [IO.Path]::DirectorySeparatorChar)
      $Relative = $Decoded.TrimStart([char[]]@('/', '\'))
      if ([string]::IsNullOrWhiteSpace($Relative)) { $Relative = 'index.html' }

      $Candidate = [IO.Path]::GetFullPath((Join-Path $SiteRoot $Relative))
      $RootPrefix = $SiteRoot.TrimEnd('\') + '\'
      if (-not ($Candidate -eq $SiteRoot -or $Candidate.StartsWith($RootPrefix, [StringComparison]::OrdinalIgnoreCase))) {
        $Body = [Text.Encoding]::UTF8.GetBytes('Forbidden')
        Write-Response $Client 403 'Forbidden' $Body 'text/plain; charset=utf-8'
        continue
      }

      if (Test-Path $Candidate -PathType Container) {
        $Candidate = Join-Path $Candidate 'index.html'
      }

      if (-not (Test-Path $Candidate -PathType Leaf)) {
        $Body = [Text.Encoding]::UTF8.GetBytes('Not Found')
        Write-Response $Client 404 'Not Found' $Body 'text/plain; charset=utf-8'
        continue
      }

      $Bytes = [IO.File]::ReadAllBytes($Candidate)
      Write-Response $Client 200 'OK' $Bytes (Get-MimeType $Candidate) ($Method -eq 'HEAD')
    } catch {
      try {
        $Body = [Text.Encoding]::UTF8.GetBytes('Internal Server Error')
        Write-Response $Client 500 'Internal Server Error' $Body 'text/plain; charset=utf-8'
      } catch {}
    } finally {
      $Client.Close()
    }
  }
} finally {
  $Listener.Stop()
}
