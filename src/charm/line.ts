import { Vec2 } from "./geometry";

export class Line
{
    private element: SVGElement;
    from: Vec2;
    to: Vec2;

    constructor(from: Vec2, to: Vec2)
    {
        this.from = from;
        this.to = to;

        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.element.setAttribute('x1', from.x.toString());
        this.element.setAttribute('y1', from.y.toString());
        this.element.setAttribute('x2', to.x.toString());
        this.element.setAttribute('y2', to.y.toString());
        this.element.setAttribute('stroke', 'white');

        document.querySelector('svg')!.appendChild(this.element);
    }
}