import { CommandArgs } from "../dispatcher";
import { exec } from "node:child_process";
import { FSWatcher, watch } from "chokidar";
import { promisify } from "node:util";
import { startServer, refreshBrowser } from "../test-server";
import { join } from 'node:path';
import chalk from "chalk";
import { charmJS } from "../ascii-art";
import { printDisappearing } from "../cmd";

const runCmdCommand = promisify(exec);

/*
Since i dont need it for now, i have yet to implement a proper output system for the
CLI, so i just bruteforced this one. I know these functions are very far from readable, 
but i tried to space out the lines of code that actually do something from the ones that
just log the status of the execution.
*/
export default async function main(projectPath: string, args: CommandArgs)
{
    printWelcomeText(projectPath.split('\\').pop());

    const fileChangesWatcher:FSWatcher = watch(projectPath, {ignored: /^\./, persistent: true, ignoreInitial: true});

    fileChangesWatcher
        .on('add', reload)
        .on('change', reload)
        .on('unlink', reload);
    
    process.stdout.write(`
[ ] compile ${chalk.whiteBright.bold('Typescript')} files <
[ ] start ${chalk.whiteBright.bold('local server')}
[ ] open ${chalk.whiteBright.bold('browser')}\n\n`);

    await runCmdCommand(`npx webpack`);

    process.stdout.moveCursor(0, -5);
    process.stdout.clearScreenDown();
    process.stdout.write(`
[${chalk.whiteBright.bold('✓')}] compile ${chalk.whiteBright.bold('Typescript')} files
[ ] start ${chalk.whiteBright.bold('local server')} <
[ ] open ${chalk.whiteBright.bold('browser')}\n\n`);

    startServer(4200, join(projectPath, 'dist'));

    process.stdout.moveCursor(0, -5);
    process.stdout.clearScreenDown();
    process.stdout.write(`
[${chalk.whiteBright.bold('✓')}] compile ${chalk.whiteBright.bold('Typescript')} files
[${chalk.whiteBright.bold('✓')}] start ${chalk.whiteBright.bold('local server')}
[ ] open ${chalk.whiteBright.bold('browser')} <\n\n`);

    const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    await runCmdCommand(`${start} http://localhost:4200`);

    process.stdout.moveCursor(0, -5);
    process.stdout.clearScreenDown();
    process.stdout.write(`
[${chalk.whiteBright.bold('✓')}] compile ${chalk.whiteBright.bold('Typescript')} files
[${chalk.whiteBright.bold('✓')}] start ${chalk.whiteBright.bold('local server')}
[${chalk.whiteBright.bold('✓')}] open ${chalk.whiteBright.bold('browser')}


--- The dev. environment has been arranged 🎩 ---\n\n`);

    console.log(chalk.italic('You may terminate the execution by pressing ') + chalk.bold.whiteBright('[CTRL + C]') + chalk.italic(' or by closing the terminal.\n'));
    printDisappearing('Status: ' + chalk.bold.whiteBright('RUNNING'));
}

function printWelcomeText(projectName: string)
{
    console.log('\n');
    console.log(chalk.whiteBright(charmJS));
    console.log('\n');
    console.log(`--- Preparing the dev. environment for the project ${chalk.whiteBright.bold(projectName)} ---\n`);
}

async function reload(triggerPath: string)
{
    const runWebpack = !triggerPath || triggerPath.endsWith('.js') || triggerPath.endsWith('.ts');

    if(runWebpack)
    {
        printDisappearing('Status: ' + chalk.bold.gray('compiling Typescript'));
        
        exec(`npx webpack`, (error, stdout, stderr) =>
        {
            if(error)
            {
                printDisappearing(chalk.bold.redBright('Error while compiling TypeScript: ') + chalk.redBright(stdout));
                return;
            }
        });
    }

    printDisappearing('Status: ' + chalk.bold.whiteBright('RUNNING'));

    refreshBrowser();
}