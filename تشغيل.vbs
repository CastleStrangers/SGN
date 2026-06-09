Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "D:\I-Ai\App\Syrian community in the Netherlands\SGN"
WshShell.Run "cmd /c npm run dev", 1, False
WScript.Sleep 5000
WshShell.Run "http://localhost:3000/join", 1, False
