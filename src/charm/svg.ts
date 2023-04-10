import { Vec2, getCoords } from "./geometry";
import { Line } from "./line";
import { getLineTips } from "./parser";
import { stringToHTML } from "./qol";

addEventListener('resize', refreshSvgSize);
document.addEventListener('DOMContentLoaded', refreshSvgSize);
   
const resizeObserver = new ResizeObserver(updateAnimationResultSize);

export function fixToElement(element: HTMLElement, lines: Line[])
{
    let svg = element.parentElement!.querySelector(':scope > .animation-result') as HTMLElement;
    if(svg == null)
    {
        svg = stringToHTML('<svg xmlns="http://www.w3.org/2000/svg" class="animation-result" viewBox="0 0 0 0" style="width: 0; height: 0"></svg>');
        const bounding = stringToHTML('<div style="position: relative"></div>');

        const elementStyle = getComputedStyle(element);
        bounding.style.display = elementStyle.display;
        element.parentElement?.replaceChild(bounding, element);
        bounding.appendChild(element);
        bounding.appendChild(svg);
        
        storeSize(element);
        resizeObserver.observe(element);
    }

    const svgSize = getCoords(svg);

    const oldSize = new Vec2(svgSize.width, svgSize.height);
    const newSize = calculateNewSize(lines);

    if(oldSize.x < newSize.x || oldSize.y < newSize.y)
    {
        resizeSVG(svg, newSize);
        repositionExistingLines(svg, oldSize, newSize);
    }

    appendLinesToSvg(svg, lines);
}

function storeSize(element: HTMLElement)
{
    const elementRect = getCoords(element);
    element.setAttribute('curr-width', elementRect.width.toString());
    element.setAttribute('curr-height', elementRect.height.toString());
}

function updateAnimationResultSize(entries: ResizeObserverEntry[])
{
    const element = entries[0].target as HTMLElement;
    const rect = getCoords(element);
    const svg = element.parentElement!.querySelector(':scope > .animation-result') as HTMLElement;
    const svgRect = getCoords(svg);
    
    const oldSize = new Vec2(parseFloat(element.getAttribute('curr-width')!),parseFloat(element.getAttribute('curr-height')!));
    const newSize = new Vec2(rect.width, rect.height);
    
    const scaleX = newSize.x / oldSize.x;
    const scaleY = newSize.y / oldSize.y;
    
    const newSVGSize = new Vec2(svgRect.width * scaleX, svgRect.height * scaleY);
    resizeSVG(svg, newSVGSize);

    const newSvgRect = getCoords(svg);
    const change = new Vec2(newSvgRect.x, newSvgRect.y);

    getLinesInSVG(svg).forEach(line =>
    {
        const newTo: Vec2[] = getLineTips(line.svg.getAttribute('endTo')!, element)!;

        if(line.svg.hasAttribute('isSticky'))
        {
            newTo[0] = getLineTips(line.svg.getAttribute('isSticky')!, element)![0];
        }

        line.from = newTo[0].minus(change);
        line.to = newTo[1].minus(change);
        line.updateElement();
    });

    storeSize(element);
}

function appendLinesToSvg(svg: HTMLElement, lines: Line[])
{
    const rect = getCoords(svg);
    const change = new Vec2(rect.x, rect.y);


    lines.forEach(line => 
    {
        svg.appendChild(line.svg);

        line.from = line.from.minus(change);
        line.to = line.to.minus(change);

        console.log(line.from);

        line.updateElement();
    })
}

function resizeSVG(svg: HTMLElement, size: Vec2)
{
    svg.style.width = size.x + 'px';
    svg.style.height = size.y + 'px';
    svg.setAttribute('viewBox', `0 0 ${size.x} ${size.y}`);
}

function calculateNewSize(lines: Line[])
{
    let minX = window.innerWidth;
    let minY = window.innerHeight;
    let maxX = 0;
    let maxY = 0;
    
    lines.forEach(line =>
    {
        if(line.from.x < minX)
            minX = line.from.x;
        else if(line.to.x < minX)
            minX = line.to.x;

        if(line.from.y < minY)
            minY = line.from.y;
        else if(line.to.y < minY)
            minY = line.to.y;

        if(line.from.x > maxX)
            maxX = line.from.x;
        else if(line.to.x > maxX)
            maxX = line.to.x;

        if(line.from.y > maxY)
            maxY = line.from.y;
        else if(line.to.y > maxY)
            maxY = line.to.y;
    });

    return new Vec2(maxX - minX + 2, maxY - minY + 2);
}

function repositionExistingLines(svg: HTMLElement, oldSize: Vec2, newSize: Vec2)
{
    const lines: Line[] = getLinesInSVG(svg);

    const changeX = (oldSize.x - newSize.x) / 2;
    const changeY =(oldSize.y - newSize.y) / 2;
    const change = new Vec2(changeX, changeY);

    lines.forEach(line =>
    {
        line.from = line.from.plus(change);
        line.to = line.to.plus(change);
        line.updateElement();
    });
}

function getLinesInSVG(svg: HTMLElement)
{
    const lines: Line[] = [];
    svg.querySelectorAll('line').forEach(line => lines.push(Line.getFromSvg((line as Element) as HTMLElement)));

    return lines;
}

function refreshSvgSize()
{
    const svgs = document.querySelectorAll('svg.fullscreen');

    fixBastardBug();

    svgs.forEach((svg) =>
    {
        scaleSVGToFill(svg as HTMLElement);
    })
}

/**
 fuck you.
 i have no fucking clue why but if you dont have these 2 lines of code
 EXACTLY HERE the page just randomly spawns a fucking scrollbar EVEN IF THERES 
 NOTHING TO FUCKING SCROLL.
*/
function fixBastardBug()
{
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.body.style.overflow = 'auto', 1);
}

export function scaleSVGToFill(svg: HTMLElement)
{

    const width = getCoords(document.body).width;
    const hieght = getCoords(document.body).height;
    svg.setAttribute('viewBox', `0 0 ${width} ${hieght}`);
}