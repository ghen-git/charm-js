export function parse(element: HTMLElement, instructionsString: string, attrName: string)
{
    const instructions = parseToJSON(instructionsString);

    console.log(instructions.animation[0]);
}

function parseToJSON(s: string)
{
    s = s.replace(/\s/g, "");
    s = s.replace(/(['"])?([a-z0-9A-Z_\.-]+)(['"])?/g, '"$2"');
    s = s.replace(/(")([0-9]+)(")/g, '$2');

    return JSON.parse(s);
}