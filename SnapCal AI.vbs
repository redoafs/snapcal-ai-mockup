' SnapCal AI - buka aplikasi (tanpa jendela hitam).
Option Explicit
Dim fso, sh, here, ps1
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh  = CreateObject("WScript.Shell")
here = fso.GetParentFolderName(WScript.ScriptFullName)
ps1 = here & "\scripts\snapcal-app.ps1"
sh.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1 & """", 0, False
