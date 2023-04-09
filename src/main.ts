import './charm/style.css';
import './charm/charm';
import { Line } from './charm/line';
import { Vec2 } from './charm/geometry';
import { TimingFunction } from './charm/animations';

document.addEventListener('DOMContentLoaded', () =>
{
});

// window.ontouchmove = (e) =>
// {
//     shootCross(new Vec2(e.touches[0].clientX, e.touches[0].clientY));
// }
// window.onclick = (e) =>
// {
//     shootCross(new Vec2(e.x, e.y));
// }

// async function shootLine(target: Vec2)
// {
//     const line: Line = new Line(new Vec2(window.innerWidth / 2, 0), new Vec2(window.innerWidth / 2, 0));
//     document.querySelector('svg')?.appendChild(line.svg);

//     line.animate(target, target, 5, 1, TimingFunction.easeInOut)
//         .animate(new Vec2(window.innerWidth / 2, 0), new Vec2(window.innerWidth / 2, 0), 5, 1, TimingFunction.easeInOut)
//         .animate(target, target, 5, 1, TimingFunction.easeInOut);
// }

// function shootCross(target: Vec2)
// {
    
//     const top: Line = new Line(new Vec2(target.x, 0), new Vec2(target.x, 0));
//     document.querySelector('svg')?.appendChild(top.svg);
//     top.animateWithMinLength(target, target, 0.3, 50);

//     const left: Line = new Line(new Vec2(0, target.y), new Vec2(0, target.y));
//     document.querySelector('svg')?.appendChild(left.svg);
//     left.animateWithMinLength(target, target, 0.3, 50);

//     const right: Line = new Line(new Vec2(window.innerWidth, target.y), new Vec2(window.innerWidth, target.y));
//     document.querySelector('svg')?.appendChild(right.svg);
//     right.animateWithMinLength(target, target, 0.3, 50);

//     const bottom: Line = new Line(new Vec2(target.x, window.innerHeight), new Vec2(target.x, window.innerHeight));
//     document.querySelector('svg')?.appendChild(bottom.svg);
//     bottom.animateWithMinLength(target, target, 0.3, 50);
// }