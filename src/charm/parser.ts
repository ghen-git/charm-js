import { Animation, AnimationOptions, LineAnimation } from "./animation";
import { TimingFunction } from "./animations";
import { Vec2 } from "./geometry";
import { Line } from "./line";

interface Instructions
{
    animation?: AnimationInstructions[],
}

interface AnimationInstructions
{
    lines: LineAnimationInstructions[],
    duration?: number,
    delay?: number,
    length?: number,
    discard?: boolean,
    stick?: boolean,
    timingFunction?: TimingFunction
}

interface LineAnimationInstructions
{
    from: string,
    to: string,
    duration?: number,
    delay?: number,
    length?: number,
    discard?: boolean,
    stick?: boolean,
    timingFunction?: TimingFunction
}

export async function parse(element: HTMLElement, instructionsString: string, attrName: string)
{
    const instructions = parseToJSON(instructionsString) as Instructions;

    const animations: Animation[] = [];

    for(const animationInstructions of instructions.animation!)
    {
        animations.push(parseAnimation(element, animationInstructions));
    }

    console.log(animations);

    for(const animation of animations)
    {
        await animation.animate();
    }
}

function parseToJSON(s: string)
{
    s = s.replace(/\s/g, "");
    s = s.replace(/(['"])?([a-z0-9A-Z_\.-]+)(['"])?/g, '"$2"');
    s = s.replace(/(")([0-9]+)(")/g, '$2');

    return JSON.parse(s);
}

function parseAnimation(element: HTMLElement, instructions: AnimationInstructions)
{
    const lines: LineAnimation[] = [];

    const options = getOptions(instructions);

    for(const line of instructions.lines!)
        lines.push(parseLine(element, line, options));

    return new Animation(lines, options)
}

function parseLine(element: HTMLElement, instructions: LineAnimationInstructions, globalOptions: AnimationOptions): LineAnimation
{
    const from = parseFloat(instructions.from);
    const to = parseFloat(instructions.to);

    const line = new Line(new Vec2(from), new Vec2(from));

    const endFrom = instructions.stick || globalOptions.stick ? new Vec2(from) : new Vec2(to);
    
    return {
        line: line,
        endFrom: endFrom,
        endTo: new Vec2(to),
        options: getOptions(instructions)
    }
}

function getOptions(instructions: LineAnimationInstructions | AnimationInstructions)
{
    const options: AnimationOptions = {};

    if(instructions.duration)
        options.duration = instructions.duration;
    if(instructions.delay)
        options.delay = instructions.delay;
    if(instructions.length)
        options.minLength = instructions.length;
    if(instructions.discard)
        options.discard = instructions.discard;
    if(instructions.stick)
        options.stick = instructions.stick as boolean;
    if(instructions.timingFunction)
        options.timingFunction = instructions.timingFunction;

    return options;
}