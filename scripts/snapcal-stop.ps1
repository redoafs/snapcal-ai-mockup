# SnapCal AI - hentikan server background
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $root 'logs'
$pidFile = Join-Path $logDir 'snapcal.pid'

$killed = @()

if (Test-Path $pidFile) {
  $savedPid = (Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($savedPid) {
    Stop-Process -Id ([int]$savedPid) -Force -ErrorAction SilentlyContinue
    $killed += [int]$savedPid
  }
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

$conns = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
foreach ($c in $conns) {
  if ($killed -notcontains $c.OwningProcess) {
    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
    $killed += $c.OwningProcess
  }
}

$ws = New-Object -ComObject WScript.Shell
if ($killed.Count -gt 0) {
  $null = $ws.Popup("Server SnapCal AI dihentikan (PID: " + ($killed -join ', ') + ").", 5, 'SnapCal AI', 0)
} else {
  $null = $ws.Popup('Tidak ada server SnapCal AI yang sedang berjalan.', 5, 'SnapCal AI', 0)
}
