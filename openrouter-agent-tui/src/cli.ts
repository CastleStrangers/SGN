import { OpenRouter, callModel, tool } from '@openrouter/agent';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { customReadLine } from './custom-readline.js';

const execPromise = promisify(exec);

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const MAGENTA = '\x1b[35m';
const GRAY = '\x1b[90m';
const WHITE = '\x1b[97m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Configuration
interface DisplayConfig {
  inputStyle: 'block' | 'bordered' | 'plain';
  toolDisplay: 'emoji' | 'grouped' | 'minimal' | 'hidden';
  loader: {
    style: 'spinner' | 'gradient' | 'minimal';
    text: string;
  };
}

const config: { model: string; display: DisplayConfig } = {
  model: 'google/gemini-2.5-flash', // Default high-speed model
  display: {
    inputStyle: 'block',
    toolDisplay: 'grouped',
    loader: {
      style: 'spinner',
      text: 'Thinking...'
    }
  }
};

// 1. Tool Definitions
const readFileTool = tool({
  name: 'read_file',
  description: 'Read the contents of a text file from the workspace.',
  inputSchema: z.object({
    filePath: z.string().describe('The path of the file to read (relative or absolute).'),
  }),
  execute: async ({ filePath }: { filePath: string }) => {
    console.log(`\n${GRAY}├── Running Tool:${RESET} ${BLUE}read_file${RESET} (${GRAY}filePath: "${filePath}"${RESET})`);
    try {
      const resolved = path.resolve(filePath);
      const content = await fs.promises.readFile(resolved, 'utf-8');
      return { success: true, filePath, content };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
});

const writeFileTool = tool({
  name: 'write_file',
  description: 'Write or overwrite a file in the workspace with new content.',
  inputSchema: z.object({
    filePath: z.string().describe('The destination path of the file.'),
    content: z.string().describe('The file content to write.'),
  }),
  execute: async ({ filePath, content }: { filePath: string; content: string }) => {
    console.log(`\n${GRAY}├── Running Tool:${RESET} ${BLUE}write_file${RESET} (${GRAY}filePath: "${filePath}"${RESET})`);
    try {
      const resolved = path.resolve(filePath);
      await fs.promises.mkdir(path.dirname(resolved), { recursive: true });
      await fs.promises.writeFile(resolved, content, 'utf-8');
      return { success: true, filePath };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
});

const runCommandTool = tool({
  name: 'run_command',
  description: 'Run a shell command on the host machine and get its output.',
  inputSchema: z.object({
    command: z.string().describe('The shell command line to run.'),
  }),
  execute: async ({ command }: { command: string }) => {
    console.log(`\n${GRAY}├── Running Tool:${RESET} ${BLUE}run_command${RESET} (${GRAY}command: "${command}"${RESET})`);
    try {
      const { stdout, stderr } = await execPromise(command);
      return { success: true, stdout, stderr };
    } catch (e: any) {
      return { success: false, error: e.message, stderr: e.stderr || '' };
    }
  },
});

const tools = [readFileTool, writeFileTool, runCommandTool];

// Loader helper
class Spinner {
  private timer: NodeJS.Timeout | null = null;
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private idx = 0;

  start(text: string) {
    if (config.display.loader.style === 'minimal') {
      process.stdout.write(`${text}... `);
      return;
    }
    
    let frameCount = 0;
    this.timer = setInterval(() => {
      process.stdout.write('\r');
      if (config.display.loader.style === 'gradient') {
        // Rainbow color shimmer over text
        const colors = [31, 33, 32, 36, 34, 35];
        const color = colors[frameCount % colors.length];
        process.stdout.write(`\x1b[${color}m${text}\x1b[0m`);
      } else {
        const frame = this.frames[this.idx % this.frames.length];
        process.stdout.write(`${CYAN}${frame}${RESET} ${text}`);
        this.idx++;
      }
      frameCount++;
    }, 80);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    process.stdout.write('\r\x1b[2K'); // Clear loader line
  }
}

// Banner helper
function printBanner() {
  const banner = `
${CYAN}${BOLD}██████╗ ██████╗ ███████╗███╗   ██╗██████╗  ██████╗ ██╗   ██╗████████╗███████╗██████╗ 
██╔═══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗
██║   ██║██████╔╝█████╗  ██╔██╗ ██║██████╔╝██║   ██║██║   ██║   ██║   █████╗  ██████╔╝
██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ██╔══██╗
╚██████╔╝██║     ███████╗██║ ╚████║██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗██║  ██║
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝${RESET}
                             ${BOLD}OpenRouter Terminal Agent (TUI)${RESET}
  `;
  console.log(banner);
  console.log(`${GRAY}Active Model:${RESET} ${YELLOW}${config.model}${RESET}`);
  console.log(`${GRAY}Commands:${RESET} ${GREEN}/model <name>${RESET} | ${GREEN}/clear${RESET} | ${GREEN}/exit${RESET}`);
}

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY || '';
  if (!apiKey) {
    console.error(`${RED}${BOLD}Error:${RESET} OPENROUTER_API_KEY environment variable is not defined.`);
    console.log(`${GRAY}Please export it: export OPENROUTER_API_KEY="sk-or-v1-..."${RESET}`);
    process.exit(1);
  }

  const client = new OpenRouter({ apiKey });
  printBanner();

  const sessionHistory: any[] = [];
  const spinner = new Spinner();

  // Background tint detection mock
  const bgInput = '\x1b[48;5;235m'; // Dark gray block background

  while (true) {
    // 1. Get input
    let input = '';
    try {
      if (config.display.inputStyle === 'block') {
        input = await customReadLine('block', bgInput);
      } else if (config.display.inputStyle === 'bordered') {
        input = await customReadLine('bordered', '');
      } else {
        process.stdout.write(`\n${GREEN}>${RESET} `);
        input = await new Promise<string>((resolve) => {
          process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
          });
        });
      }
    } catch (e) {
      console.log('\nExit.');
      break;
    }

    const trimmed = input.trim();
    if (!trimmed) continue;

    // 2. Handle slash commands
    if (trimmed.startsWith('/')) {
      const parts = trimmed.split(' ');
      const cmd = parts[0].toLowerCase();
      if (cmd === '/exit' || cmd === '/quit') {
        console.log('Goodbye!');
        break;
      }
      if (cmd === '/clear') {
        console.clear();
        printBanner();
        sessionHistory.length = 0;
        continue;
      }
      if (cmd === '/model') {
        if (parts[1]) {
          config.model = parts[1];
          console.log(`${GREEN}Active model set to:${RESET} ${YELLOW}${config.model}${RESET}`);
        } else {
          console.log(`Current model: ${YELLOW}${config.model}${RESET}`);
        }
        continue;
      }
      console.log(`${RED}Unknown command: ${cmd}${RESET}`);
      continue;
    }

    // 3. Call model agent loop
    sessionHistory.push({ role: 'user', content: trimmed });
    spinner.start(config.display.loader.text);

    try {
      const result = await callModel(client, {
        model: config.model,
        input: sessionHistory as any,
        tools: tools,
      });

      spinner.stop();

      // Read final text
      const finalResponse = await result.getText();
      console.log(`\n${finalResponse}\n`);

      sessionHistory.push({ role: 'assistant', content: finalResponse });
    } catch (e: any) {
      spinner.stop();
      console.error(`\n${RED}${BOLD}Execution Error:${RESET} ${e.message}\n`);
    }
  }
}

main().catch(console.error);
