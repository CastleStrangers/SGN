Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "D:\I-Ai\App\Syrian community in the Netherlands\SGN"
WshShell.Run "powershell -ExecutionPolicy Bypass -File autosync.ps1", 0, False
