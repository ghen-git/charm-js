import './charm/style.css';
import './charm/charm';
import { Line } from './charm/line';
import { Vec2 } from './charm/geometry';
import { TimingFunction } from './charm/animations';

document.addEventListener('DOMContentLoaded', () =>
{
});

window.onclick = (e) =>
{
    shootLine(new Vec2(e.x, e.y));
}

async function shootLine(target: Vec2)
{
    const line: Line = new Line(new Vec2(window.innerWidth / 2, 0), new Vec2(window.innerWidth / 2, 0));
    document.querySelector('svg')?.appendChild(line.svg);

    line.animateWithMinLength(target, target, 0.5, 100, TimingFunction.easeInOut)
        .animateWithMinLength(new Vec2(window.innerWidth / 2, 0), new Vec2(window.innerWidth / 2, 0), 0.5, 10, TimingFunction.easeInOut)
        .animateWithMinLength(target, target, 0.5, 100, TimingFunction.easeInOut);
}

function shootCross(target: Vec2)
{
    
    const top: Line = new Line(new Vec2(target.x, 0), new Vec2(target.x, 0));
    document.querySelector('svg')?.appendChild(top.svg);
    top.animateWithMinLength(target, target, 4, 50);

    const left: Line = new Line(new Vec2(0, target.y), new Vec2(0, target.y));
    document.querySelector('svg')?.appendChild(left.svg);
    left.animateWithMinLength(target, target, 4, 50);

    const right: Line = new Line(new Vec2(window.innerWidth, target.y), new Vec2(window.innerWidth, target.y));
    document.querySelector('svg')?.appendChild(right.svg);
    right.animateWithMinLength(target, target, 4, 50);

    const bottom: Line = new Line(new Vec2(target.x, window.innerHeight), new Vec2(target.x, window.innerHeight));
    document.querySelector('svg')?.appendChild(bottom.svg);
    bottom.animateWithMinLength(target, target, 4, 50);
}