import { emitKeypressEvents, createInterface } from 'readline';
/**
 * Advanced raw TTY readline supporting:
 * - Multi-line editing via Shift+Enter or Option+Enter (Meta+Enter)
 * - Standard TTY cursor movement with Left, Right, Up, and Down arrow keys
 * - Deletion at cursor position (Backspace, Delete)
 * - Custom cursor insertion logic (prepending or inserting text anywhere in the buffer)
 * - Auto-adapting for 'block' (background filled) and 'bordered' (horizontal borders) input styles
 */
export function customReadLine(style, bg) {
    // Non-TTY Fallback
    if (!process.stdin.isTTY) {
        return new Promise((resolve) => {
            const rl = createInterface({ input: process.stdin, output: process.stdout });
            rl.once('line', (line) => {
                rl.close();
                resolve(line);
            });
        });
    }
    return new Promise((resolve) => {
        let buffer = '';
        let cursor = 0;
        const state = {
            first: true,
            lastNumLines: 1,
            lastCursorLine: 0,
        };
        const WHITE = '\x1b[97m';
        const RESET = '\x1b[0m';
        const GRAY = '\x1b[90m';
        const promptPrefix = style === 'block' ? ' › ' : '› ';
        const indentPrefix = style === 'block' ? '   ' : '  ';
        const promptLen = promptPrefix.length;
        const indentLen = indentPrefix.length;
        function draw() {
            const width = process.stdout.columns || 80;
            const border = `${GRAY}${'─'.repeat(width)}${RESET}`;
            const lines = buffer.split('\n');
            const numLines = lines.length;
            // Calculate cursor coordinates (line and column)
            let cursorLine = 0;
            let cursorCol = 0;
            const lineStarts = [0];
            for (let i = 0; i < buffer.length; i++) {
                if (buffer[i] === '\n') {
                    lineStarts.push(i + 1);
                }
            }
            for (let i = 0; i < lineStarts.length; i++) {
                if (cursor >= lineStarts[i]) {
                    cursorLine = i;
                    cursorCol = cursor - lineStarts[i];
                }
            }
            if (state.first) {
                // Draw top decoration
                if (style === 'block') {
                    process.stdout.write(`\n${bg}\x1b[K${RESET}\n`);
                }
                else {
                    process.stdout.write(`\n${border}\n`);
                }
                // Draw initial lines
                for (let i = 0; i < numLines; i++) {
                    if (i > 0)
                        process.stdout.write('\n');
                    const prefix = i === 0 ? promptPrefix : indentPrefix;
                    if (style === 'block') {
                        process.stdout.write(`${bg}\x1b[K${prefix}${WHITE}${lines[i]}${RESET}`);
                    }
                    else {
                        process.stdout.write(`${prefix}${lines[i]}`);
                    }
                }
                // Draw bottom decoration
                if (style === 'block') {
                    process.stdout.write(`\n${bg}\x1b[K${RESET}`);
                }
                else {
                    process.stdout.write(`\n${border}`);
                }
                state.first = false;
            }
            else {
                // Return cursor to start of the first input line (line 0)
                if (state.lastCursorLine > 0) {
                    process.stdout.write(`\x1b[${state.lastCursorLine}A`);
                }
                process.stdout.write('\r');
                // Draw and clear lines
                for (let i = 0; i < numLines; i++) {
                    if (i > 0) {
                        process.stdout.write('\n');
                    }
                    process.stdout.write('\r\x1b[2K'); // Clear line in-place
                    const prefix = i === 0 ? promptPrefix : indentPrefix;
                    if (style === 'block') {
                        process.stdout.write(`${bg}\x1b[K${prefix}${WHITE}${lines[i]}${RESET}`);
                    }
                    else {
                        process.stdout.write(`${prefix}${lines[i]}`);
                    }
                }
                // Clear any leftover lines if current input has fewer lines than last draw
                const lineDiff = state.lastNumLines - numLines;
                if (lineDiff > 0) {
                    for (let i = 0; i < lineDiff; i++) {
                        process.stdout.write('\n\r\x1b[2K');
                        if (style === 'block') {
                            process.stdout.write(`${bg}\x1b[K${RESET}`);
                        }
                    }
                    // Move cursor back up to the end of the input lines
                    process.stdout.write(`\x1b[${lineDiff}A`);
                }
                // Redraw bottom decoration to keep it at the end
                process.stdout.write('\n\r\x1b[2K');
                if (style === 'block') {
                    process.stdout.write(`${bg}\x1b[K${RESET}`);
                }
                else {
                    process.stdout.write(`${border}`);
                }
            }
            // Position terminal cursor at the correct coordinates
            const moveUp = numLines - cursorLine;
            if (moveUp > 0) {
                process.stdout.write(`\x1b[${moveUp}A`);
            }
            const col = (cursorLine === 0 ? promptLen : indentLen) + cursorCol;
            process.stdout.write(`\r\x1b[${col + 1}G`);
            // Update state for next draw
            state.lastNumLines = numLines;
            state.lastCursorLine = cursorLine;
        }
        draw();
        emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        const onKeypress = (_ch, key) => {
            // Calculate current line and positions for navigation helpers
            const lineStarts = [0];
            for (let i = 0; i < buffer.length; i++) {
                if (buffer[i] === '\n') {
                    lineStarts.push(i + 1);
                }
            }
            let currentLine = 0;
            let currentCol = 0;
            for (let i = 0; i < lineStarts.length; i++) {
                if (cursor >= lineStarts[i]) {
                    currentLine = i;
                    currentCol = cursor - lineStarts[i];
                }
            }
            // Handle Ctrl+C (Safe Exit)
            if (key && key.ctrl && key.name === 'c') {
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeListener('keypress', onKeypress);
                process.stdout.write(`${RESET}\n`);
                process.exit(0);
            }
            // Handle Enter (Normal & Shift/Option)
            if (key && key.name === 'return') {
                if (key.shift || key.meta) {
                    // Shift+Enter / Option+Enter -> Insert newline
                    buffer = buffer.slice(0, cursor) + '\n' + buffer.slice(cursor);
                    cursor++;
                    draw();
                }
                else {
                    // Normal Enter -> Submit
                    process.stdin.setRawMode(false);
                    process.stdin.pause();
                    process.stdin.removeListener('keypress', onKeypress);
                    // Move terminal cursor below TUI block so subsequent output renders clean
                    const lines = buffer.split('\n');
                    const moveDown = lines.length - currentLine;
                    if (moveDown > 0) {
                        process.stdout.write(`\x1b[${moveDown}B`);
                    }
                    process.stdout.write('\r');
                    if (style === 'bordered') {
                        process.stdout.write('\x1b[2K\r'); // Erase bottom border line on submit
                    }
                    else {
                        process.stdout.write('\n');
                    }
                    resolve(buffer);
                }
                return;
            }
            // Handle Left Arrow
            if (key && key.name === 'left') {
                cursor = Math.max(0, cursor - 1);
                draw();
                return;
            }
            // Handle Right Arrow
            if (key && key.name === 'right') {
                cursor = Math.min(buffer.length, cursor + 1);
                draw();
                return;
            }
            // Handle Up Arrow (Vertical movement within buffer)
            if (key && key.name === 'up') {
                if (currentLine > 0) {
                    const prevLineStart = lineStarts[currentLine - 1];
                    const prevLineLength = lineStarts[currentLine] - 1 - prevLineStart;
                    const targetCol = Math.min(currentCol, prevLineLength);
                    cursor = prevLineStart + targetCol;
                    draw();
                }
                return;
            }
            // Handle Down Arrow (Vertical movement within buffer)
            if (key && key.name === 'down') {
                if (currentLine < lineStarts.length - 1) {
                    const nextLineStart = lineStarts[currentLine + 1];
                    const nextLineEnd = (currentLine + 2 < lineStarts.length) ? lineStarts[currentLine + 2] - 1 : buffer.length;
                    const nextLineLength = nextLineEnd - nextLineStart;
                    const targetCol = Math.min(currentCol, nextLineLength);
                    cursor = nextLineStart + targetCol;
                    draw();
                }
                return;
            }
            // Handle Backspace (Delete character behind cursor)
            if (key && key.name === 'backspace') {
                if (cursor > 0) {
                    buffer = buffer.slice(0, cursor - 1) + buffer.slice(cursor);
                    cursor--;
                    draw();
                }
                return;
            }
            // Handle Delete (Delete character at cursor)
            if (key && key.name === 'delete') {
                if (cursor < buffer.length) {
                    buffer = buffer.slice(0, cursor) + buffer.slice(cursor + 1);
                    draw();
                }
                return;
            }
            // Handle Home / Ctrl+A
            if (key && (key.name === 'home' || (key.ctrl && key.name === 'a'))) {
                cursor = lineStarts[currentLine];
                draw();
                return;
            }
            // Handle End / Ctrl+E
            if (key && (key.name === 'end' || (key.ctrl && key.name === 'e'))) {
                const lineEnd = (currentLine + 1 < lineStarts.length) ? lineStarts[currentLine + 1] - 1 : buffer.length;
                cursor = lineEnd;
                draw();
                return;
            }
            // Handle Standard Character Input / Paste (inserts at cursor)
            if (_ch && !key.ctrl && !key.meta) {
                if (!_ch.startsWith('\x1b') && _ch !== '\r' && _ch !== '\n' && _ch !== '\t') {
                    buffer = buffer.slice(0, cursor) + _ch + buffer.slice(cursor);
                    cursor += _ch.length;
                    draw();
                }
            }
        };
        process.stdin.on('keypress', onKeypress);
    });
}
