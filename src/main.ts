import './charm/style.css';
import './charm/charm';
import { Line } from './charm/line';

document.addEventListener('DOMContentLoaded', () =>
{
    const line: Line = new Line({x: 0, y: 0}, {x: 100, y: 20});
});