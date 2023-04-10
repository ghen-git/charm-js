import { Animation, AnimationOptions, LineAnimation } from "./animation";
import { TimingFunction } from "./animations";
import { Vec2, getCoords } from "./geometry";
import { Line } from "./line";
import { fixToElement } from "./svg";

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

export function parse(element: HTMLElement, instructionsString: string, attrName: string)
{
    console.log(element);
    const instructions = parseToJSON(instructionsString) as Instructions;

    const animations: Animation[] = [];

    for(const animationInstructions of instructions.animation!)
    {
        animations.push(parseAnimation(element, animationInstructions));
    }

    const event = attrName.replace('charm-', '');

    element.addEventListener(event, async() =>
    {
        const lines: Line[] = [];

        for(const animation of animations)
        {
            const animationLines = await animation.animate();
            animationLines.forEach(line => lines.push(line));
        }
        
        fixToElement(element, lines);
    })

}

const whitespaces = /\s/g;
// const vectorsWithPipes = /(:)([^\{\}\:"']+\|[^\{\}\:"']+)([,\}])/g;
const textWithoutBrackets = /(:)((?:[^"])[^{}"]+)([},])/g;
const fieldNames = /([^'"])([A-Za-z]+)([^'"])(:)/g;
const digitsWithBrackets = /(")([0-9]+)(")/g;

function parseToJSON(s: string)
{
    s = s.replace(whitespaces, "");
    s = s.replace(fieldNames, '$1"$2$3"$4');
    s = s.replace(textWithoutBrackets, '$1"$2"$3');
    s = s.replace(digitsWithBrackets, '$2');

    return JSON.parse(s);
}

function parseAnimation(element: HTMLElement, instructions: AnimationInstructions)
{
    const lines: LineAnimation[] = [];

    const options = getOptions(instructions);

    for(const line of instructions.lines!)
        lines.push(parseLine(line));

    return new Animation(element, lines, options)
}

function parseLine(instructions: LineAnimationInstructions): LineAnimation
{    
    return {
        from: instructions.from,
        to: instructions.to,
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

const isVectorsWithPipe = /^[^\|]+\|[^\|]+$/;

export function getLineTips(s: string, element: HTMLElement)
{
    if(!isVectorsWithPipe.test(s))
    {
        const v = getVector(s, element);

        if(v)
            return [v, v.clone()];
    }
    
    const vectorStrings = s.split('|');

    const v1 = getVector(vectorStrings[0], element);
    const v2 = getVector(vectorStrings[1], element);

    if(v1 && v2)
        return [v1, v2];
    
    return;
}

const isTwoNumbers = /^\[[^,]+,[^,]+\]$/;
const isSumOfVectors = /\+(?![^[]*\])/g;
const isVectorTimesNumber = /\*(?![^[]*\])/g;
const isCssVectorSelector = /^[\#\.]?(\.?[A-Za-z\-]+)+$/;

function getVector(s: string, element: HTMLElement): Vec2 | undefined
{
    if(isTwoNumbers.test(s))
    {
        const numberStr = s.split(',');

        numberStr[0] = numberStr[0].replace('[', '');
        numberStr[1] = numberStr[1].replace(']', '');

        const n1 = getNumber(numberStr[0], element);
        const n2 = getNumber(numberStr[1], element);

        if(n1 != undefined && n2 != undefined)
            return new Vec2(n1, n2);
    }
    else if(isSumOfVectors.test(s))
    {
        const v1str = s.substring(0, s.search(isSumOfVectors));
        const v2str = s.substring(s.search(isSumOfVectors) + 1);

        const v1 = getVector(v1str, element);
        const v2 = getVector(v2str, element);

        if(v1 && v2)
            return v1.plus(v2);
    }
    else if(isVectorTimesNumber.test(s))
    {
        const str1 = s.substring(0, s.search(isVectorTimesNumber));
        const str2 = s.substring(s.search(isVectorTimesNumber) + 1);

        const test = getVector(str1, element);
        
        if(!test)
        {
            const n1 = getNumber(str1, element);
            const v2 = getVector(str2, element);

            if(n1 != undefined && v2)
                return v2.times(n1);
        }
        else
        {
            const n2 = getNumber(str2, element)

            if(n2 != undefined)
                return test.times(n2);
        }
    }
    else if(isCssVectorSelector.test(s)) // css selector
    {
        return parseVectorCssSelector(s, element);
    }

    return undefined;
}

const isMathFormula = /^[\d\+\-\*\/\(\)\.]+$/;
const hasCssNumberSelectors = /[\#\.]?(\.?[A-Za-z\-]+)+/g

function getNumber(s: string, element: HTMLElement): number | undefined
{
    if(isMathFormula.test(s)) // digits
    {
        return Function(`'use strict'; return (${s})`)();
    }
    else if(hasCssNumberSelectors.test(s))
    {
        const matches = s.match(hasCssNumberSelectors);

        for(let i = matches!.length - 1; i >= 0; i--)
        {
            if(matches![i].substring(matches![i].length - 1) == '-')
                matches![i] = matches![i].substring(0, matches![i].length - 1);

            const n = parseNumberCssSelector(matches![i], element);
            
            if(n == undefined)
                return;

            s = s.replaceAll(matches![i], n.toString());
        }

        return getNumber(s, element);
    }

    return;
}

function parseNumberCssSelector(s: string, element: HTMLElement): number | undefined
{
    if(!s.includes('.'))
        return;

    const vectorCssSelector = s.substring(0, s.lastIndexOf('.'));
    const axis = s.substring(s.lastIndexOf('.') + 1);

    const v = parseVectorCssSelector(vectorCssSelector, element);

    if(!v)
        return;

    if(axis == 'x')
        return v.x;
    else if(axis == 'y')
        return v.y;

    return;
}

const positions = ['top-left', 'top-center', 'top-right', 'mid-left', 'center', 'mid-right', 'bottom-left', 'bottom-center', 'bottom-right'];

function parseVectorCssSelector(s: string, element: HTMLElement): Vec2 | undefined
{
    const windowBoundingRect: DOMRect = {
        x: 0, y: 0, width: window.innerWidth, height: window.innerHeight, 
        bottom: 0, left: 0, right: 0, top: 0, toJSON: () => {}
    };

    const sHasDots = s.includes('.');
    const indexOfFirstDot = sHasDots ? s.indexOf('.') : s.length;

    const target = s.substring(0, indexOfFirstDot);
    const selector = sHasDots ? s.substring(indexOfFirstDot + 1) : '';

    if(positions.includes(target))
    {
        return getLocalPosition(element, target);
    }
    else if(target == 'screen')   
    {
        return getLocalPosition(undefined, selector, windowBoundingRect);
    }
    else
    {
        const posSelector = !selector.includes('.') ? '' : selector.substring(selector.lastIndexOf('.') + 1);
        let selectedElement: HTMLElement | null = null;

        if(positions.includes(posSelector))
        {
            const elementSelector = selector.substring(0, selector.lastIndexOf('.'));
            selectedElement = document.querySelector(elementSelector);
        }
        else
            selectedElement = document.querySelector(posSelector);

        if(selectedElement)
            return getLocalPosition(selectedElement!, posSelector);
    }

    return undefined;
}

function getLocalPosition(element: HTMLElement | undefined, selector: string, rect?: DOMRect)
{
    const box = rect ? rect : getCoords(element!);

    switch(selector)
    {
        case 'top-left':
        {
            return new Vec2(
                box.x,
                box.y
            );
        }
        case 'top-center':
        {
            return new Vec2(
                box.x + box.width / 2,
                box.y
            );
        }
        case 'top-right':
        {
            return new Vec2(
                box.x + box.width,
                box.y
            );
        }
        case 'mid-left':
        {
            return new Vec2(
                box.x,
                box.y + box.height / 2
            );
        }
        case 'center':
        {
            return new Vec2(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
        }
        case 'mid-right':
        {
            return new Vec2(
                box.x + box.width,
                box.y + box.height / 2
            );
        }
        case 'bottom-left':
        {
            return new Vec2(
                box.x,
                box.y + box.height
            );
        }
        case 'bottom-center':
        {
            return new Vec2(
                box.x + box.width / 2,
                box.y + box.height
            );
        }
        case 'bottom-right':
        {
            return new Vec2(
                box.x + box.width,
                box.y + box.height
            );
        }
        case '':
        {
            return new Vec2(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
        }
    }

    return;
}