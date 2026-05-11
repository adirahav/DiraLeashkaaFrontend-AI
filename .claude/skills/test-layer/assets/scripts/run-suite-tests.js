import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const moduleName = process.argv[2];
if (!moduleName) {
    console.error('❌ Error: Provide a module name.');
    process.exit(1);
}

const targetModule = path.join("plan", moduleName);
const PROJECT_ROOT = path.resolve(__dirname, '../../../../../');
const MANIFEST_PATH = path.join(PROJECT_ROOT, targetModule, 'execution-manifest.md');
const LOGS_DIR = path.join(PROJECT_ROOT, 'TESTS_LOGS', moduleName);
const FRONTEND_PATH = path.join(PROJECT_ROOT, 'frontend');

function stripAnsi(text) {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
    ].join('|');
    const regex = new RegExp(pattern, 'g');
    return text.replace(regex, '');
}

async function runAutomation() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error(`❌ Error: Manifest not found at ${MANIFEST_PATH}`);
        process.exit(1);
    }

    const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
    const commands = content.match(/npx (vitest|playwright test) [^\n`]+/g) || [];
    
    if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

    const rawResults = {
        sessionInfo: {
            module: moduleName,
           
            startTime: new Date().toLocaleString('en-US', { 
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
            }).replace(/,/g, ''),
            totalCommands: commands.length
        },
        runs: []
    };

    for (const [index, cmd] of commands.entries()) {
        let finalCmd = cmd;
        if (cmd.includes('vitest') && !cmd.includes('--run')) {
            finalCmd = `${cmd} --run`;
        }

        console.log(`\n[${index + 1}/${commands.length}] 🚀 Executing: ${finalCmd}`);
        
        let output = '', status = 'SUCCESS';
        try {
            const buffer = execSync(finalCmd, { 
                cwd: FRONTEND_PATH, stdio: ['inherit', 'pipe', 'pipe'],
                env: { ...process.env, FORCE_COLOR: '0' } 
            });
            output = buffer.toString();
        } catch (e) {
            status = 'FAILURE';
            output = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');

            console.log(`\n=== FAILURE === ${output}`);
        }

        let cleanOutput = stripAnsi(output).trim();
        
        if (status === 'SUCCESS') {
            const summaryMatch = cleanOutput.match(/(Tests|Ran all|PASSED).*/g);
            cleanOutput = summaryMatch ? summaryMatch.join(' | ') : "Test Passed.";
        }

        rawResults.runs.push({ command: cmd, status, rawOutput: cleanOutput });
    }

    const logFile = path.join(LOGS_DIR, `raw-tests-data.json`);
    
    fs.writeFileSync(logFile, JSON.stringify(rawResults, null, 2));
    
    console.log(`\n✅ Done! Clean JSON saved to: ${logFile}`);
}

runAutomation();