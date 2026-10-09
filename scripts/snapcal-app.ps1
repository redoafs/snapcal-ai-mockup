# SnapCal AI - launcher aplikasi
# Menyalakan server produksi di background (tersembunyi), lalu membuka
# jendela aplikasi tanpa menu browser. Hanya dapat diakses dari PC ini.
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$nodeDir = 'C:\Program Files\nodejs'
$node    = Join-Path $nodeDir 'node.exe'
$url     = 'http://127.0.0.1:3000'

$edgeCandidates = @(
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
  "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)
$chromeCandidates = @(
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$logDir = Join-Path $root 'logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$out = Join-Path $logDir 'snapcal-out.log'
$err = Join-Path $logDir 'snapcal-err.log'
$pidFile = Join-Path $logDir 'snapcal.pid'

function Test-Server {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
    return ($r.StatusCode -eq 200)
  } catch { return $false }
}

function Show-Msg($text) {
  try {
    $ws = New-Object -ComObject WScript.Shell
    $null = $ws.Popup($text, 8, 'SnapCal AI', 0)
  } catch { Write-Host $text }
}

if (-not (Test-Path $node)) {
  Show-Msg "Node.js tidak ditemukan di $nodeDir.`nJalankan pemasangan Node.js terlebih dahulu."
  exit 1
}

# 1) Nyalakan server bila belum jalan
if (-not (Test-Server)) {
  $proc = Start-Process -FilePath $node `
    -ArgumentList @('node_modules\next\dist\bin\next', 'start', '-H', '127.0.0.1', '-p', '3000') `
    -WorkingDirectory $root -WindowStyle Hidden `
    -RedirectStandardOutput $out -RedirectStandardError $err -PassThru
  Set-Content -Path $pidFile -Value $proc.Id -Encoding ascii

  $ok = $false
  for ($i = 0; $i -lt 80; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Server) { $ok = $true; break }
    if ($proc.HasExited) { break }
  }
  if (-not $ok) {
    Show-Msg "Server gagal menyala.`nLihat log: $err"
    exit 1
  }
}

# 2) Buka jendela aplikasi
$edge = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$profile = Join-Path $env:LOCALAPPDATA 'SnapCalAI\browser-profile'
New-Item -ItemType Directory -Force -Path $profile | Out-Null

$appArgs = @(
  "--app=$url",
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=430,920',
  "--user-data-dir=$profile"
)

if ($edge) {
  Start-Process -FilePath $edge -ArgumentList $appArgs | Out-Null
} elseif ($chrome) {
  Start-Process -FilePath $chrome -ArgumentList $appArgs | Out-Null
} else {
  Start-Process $url | Out-Null
}
