# SnapCal AI - buat shortcut aplikasi di Desktop dan Start Menu.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$vbsStart = Join-Path $root 'SnapCal AI.vbs'
$vbsStop  = Join-Path $root 'Hentikan SnapCal AI.vbs'
$ico = Join-Path $root 'assets\snapcal.ico'
$ws = New-Object -ComObject WScript.Shell

function New-Lnk($dir, $name, $vbs, $desc) {
  if (-not (Test-Path $dir)) { return }
  $path = Join-Path $dir ($name + '.lnk')
  $lnk = $ws.CreateShortcut($path)
  $lnk.TargetPath = 'wscript.exe'
  $lnk.Arguments = '"' + $vbs + '"'
  $lnk.WorkingDirectory = $root
  $lnk.IconLocation = $ico
  $lnk.Description = $desc
  $lnk.Save()
  Write-Host ('  dibuat: ' + $path)
}

$desktop = [Environment]::GetFolderPath('Desktop')
$startMenu = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'

Write-Host 'Membuat shortcut...'
New-Lnk $desktop   'SnapCal AI'           $vbsStart 'SnapCal AI - buka aplikasi mockup'
New-Lnk $startMenu 'SnapCal AI'           $vbsStart 'SnapCal AI - buka aplikasi mockup'
New-Lnk $startMenu 'Hentikan SnapCal AI'  $vbsStop  'SnapCal AI - hentikan server background'
Write-Host 'Selesai.'
