import fs from 'fs';
import path from 'path';

function updateManifest() {
    const planDir = process.cwd();
    const manifestPath = path.join(planDir, 'execution-manifest.md');

    // Get Module Name from folder name
    const moduleName = path.basename(planDir);

    try {
        const files = fs.readdirSync(planDir);
        const planFiles = files.filter(f => /^\d{3}\.\d/.test(f) && f.endsWith('.md'));

        if (planFiles.length === 0) return;

        const sortedPlans = planFiles.sort();

        // Categorize commands
        const frontendCommands = [];
        const backendCommands = [];

        sortedPlans.forEach(file => {
            const filePath = path.join(planDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const commandRegex = /\*\*(npx\s+[^\*]+)\*\*/i;
            const commandMatch = content.match(commandRegex);
            const command = commandMatch ? commandMatch[1].trim() : `npx vitest [MISSING]`;
            const commandLine = `- \`${command}\``;

            // Sort by Part Number: 001-005 is Frontend, 006-009 is Backend
            const partNumber = parseInt(file.substring(0, 3));
            if (partNumber <= 5) {
                frontendCommands.push(commandLine);
            } else {
                backendCommands.push(commandLine);
            }
        });

        // Build the structured content
        const manifestContent = [
            `# Test Execution Manifest`,
            ``,
            `## Module:`,
            `${moduleName}`,
            ``,
            `## Frontend Test Suite List`,
            frontendCommands.length > 0 ? frontendCommands.join('\n') : `- [No Frontend Tests]`,
            ``,
            `## Backend Test Suite List`,
            backendCommands.length > 0 ? backendCommands.join('\n') : `- [No Backend Tests]`
        ].join('\n');

        fs.writeFileSync(manifestPath, manifestContent, 'utf8');
        console.log(`✅ Manifest synced with structure for module: ${moduleName}`);

    } catch (error) {
        console.error("--- MANIFEST UPDATE ERROR ---");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("Current Directory:", process.cwd());
        process.exit(1);
    }
}

updateManifest();