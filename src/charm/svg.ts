addEventListener('resize', refreshSvgSize);
document.addEventListener('DOMContentLoaded', refreshSvgSize);

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

    const width = document.body.getBoundingClientRect().width;
    const hieght = document.body.getBoundingClientRect().height;
    svg.setAttribute('viewBox', `0 0 ${width} ${hieght}`);
}