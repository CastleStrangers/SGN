# OpenRouter Agent TUI

A fully customizable Terminal User Interface (TUI) for AI agents built with TypeScript and the `@openrouter/agent` SDK.

---

## Features
- **Raw TTY Multi-line Editor:** Write multiple lines with `Shift+Enter` or `Option+Enter`, and navigate history and text with standard Arrow keys (`Left`, `Right`, `Up`, `Down`).
- **OpenRouter Agentic Loop:** Auto-runs multi-turn tool calls and feeds the outputs back until the model decides to stop.
- **Predefined Local Tools:**
  - `read_file`: Inspects files in the directory tree.
  - `write_file`: Generates or edits files dynamically.
  - `run_command`: Executes terminal shell commands.
- **Customizable Display Styles:** Change loader animations (spinners, scrolling gradient tints) and input styles (`block`, `bordered`, `plain`).
- **Slash Commands:** Keep control of session history and models dynamically:
  - `/model <name>`: Switch the LLM on the fly (e.g. `google/gemini-2.5-flash`, `meta-llama/llama-3.3-70b-instruct`, `anthropic/claude-3.5-sonnet`).
  - `/clear`: Reset chat memory history and clear screen.
  - `/exit` / `/quit`: Close the agent REPL loop.

---

## Quick Start

### 1. Setup Dependencies
Navigate to the directory and install libraries:
```bash
cd openrouter-agent-tui
npm install
```

### 2. Configure Environment Variable
Export your OpenRouter API key in your terminal:
```bash
# Windows PowerShell
$env:OPENROUTER_API_KEY="sk-or-v1-your-key-here"

# Windows Command Prompt
set OPENROUTER_API_KEY=sk-or-v1-your-key-here

# macOS/Linux
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
```

### 3. Run the Agent
Start the build and agent loop:
```bash
npm start
```

---

## File Structure
- `src/cli.ts` - Main loop, tool execution wrapper, config setup, and visual loaders.
- `src/custom-readline.ts` - Raw TTY handler capturing keypresses for multi-line support and cursor movements.
- `tsconfig.json` & `package.json` - Node module configuration.
