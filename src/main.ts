import './charm/style.css';
import './charm/charm';
import { Line } from './charm/line';
import { animateLinear } from './charm/animations';
import { Vec2 } from './charm/geometry';

document.addEventListener('DOMContentLoaded', () =>
{
    const line: Line = new Line({x: 0, y: 100}, {x: 100, y: 100});
    document.querySelector('svg')?.appendChild(line.svg);
    
    animateLinear(line, 10);
});