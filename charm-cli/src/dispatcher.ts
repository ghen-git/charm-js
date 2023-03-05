export type CommandArgs = {[name: string]: any};
type CommandAction = (path: string, args: {}) => void; 

const commands: {[name: string]: CommandAction} = {};

export function addCommand(name: string, action: CommandAction)
{
    if(Object.keys(commands).includes(name))
        return;
    
    commands[name] = action;
}

export function dispatch()
{
    const commandName: string = process.argv[2];

    if(!Object.keys(commands).includes(commandName))
        return;

    const args: CommandArgs = readArgs(process.argv.slice(3, process.argv.length - 3 + 1));

    commands[commandName](process.cwd(), args);
}

function readArgs(argStrings: string[])
{
    const args: CommandArgs = {};
    let activeArg: string = undefined;

    for(const arg of argStrings)
    {
        if(Object.keys(args).includes(arg))
            continue;
        
        activeArg = processArg(arg, activeArg, args);
    }
    processArg(undefined, activeArg, args);

    return args;
}

function processArg(arg: string, activeArg: string, args: CommandArgs)
{
    const activeArgHasValue: boolean = Object.keys(args).includes(activeArg);
    const argIsParam = arg != undefined && !arg.startsWith('--');

    if(activeArg == undefined)
    {
        activeArg = arg;
        return activeArg;
    }

    if(!argIsParam)
    {
        if(!activeArgHasValue)
            args[activeArg] = true;

        activeArg = arg;
        return activeArg;
    }

    if(!activeArgHasValue)
    {
        args[activeArg] = arg;
        return activeArg;
    }
    
    const argIsArray: boolean = Array.isArray(args[activeArg]);
    if(!argIsArray)
    {
        const argValue: any = args[activeArg];
        args[activeArg] = [argValue, arg];
    }
    else
    {
        args[activeArg].push(arg);
    }

    return activeArg;
}