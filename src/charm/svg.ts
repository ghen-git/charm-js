addEventListener('resize', refreshSvgSize);
document.addEventListener('DOMContentLoaded', refreshSvgSize);

function refreshSvgSize()
{
    const svgs = document.querySelectorAll('svg.fullscreen');

    svgs.forEach((svg) =>
    {
        scaleSVGToFill(svg as HTMLElement);
    })
}

export function scaleSVGToFill(svg: HTMLElement)
{
    svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
}