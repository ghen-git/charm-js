import { Animatable } from "./animatable";
import { Vec2 } from "./geometry";

const from = new Vec2(500, 500);
const to = new Vec2(1000, 1000);

export class Line implements Animatable
{
    svg: SVGElement;
    from: Vec2;
    to: Vec2;
    length: number;

    constructor(from: Vec2, to: Vec2)
    {
        this.from = from;
        this.to = to;

        this.length = Vec2.distance(from, to);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.svg.setAttribute('x1', from.x.toString());
        this.svg.setAttribute('y1', from.y.toString());
        this.svg.setAttribute('x2', to.x.toString());
        this.svg.setAttribute('y2', to.y.toString());
        this.svg.setAttribute('stroke', 'white');

        // document.querySelector('svg')!.appendChild(this.element);
    }

    getStartingPos()
    {
        return this.to;
    }

    animationTick(step: number)
    {
        console.log(step);

        this.from.x = (1 - step) * this.from.x + step * from.x;
        this.from.y = (1 - step) * this.from.y + step * from.y;
        this.to.x = (1 - step) * this.to.x + step * to.x;
        this.to.y = (1 - step) * this.to.y + step * to.y;

        this.updateElement();
    }

    updateElement()
    {
        this.svg.setAttribute('x1', this.from.x.toString());
        this.svg.setAttribute('y1', this.from.y.toString());
        this.svg.setAttribute('x2', this.to.x.toString());
        this.svg.setAttribute('y2', this.to.y.toString());
    }

    getPointAtDistance(start: Vec2, distance: number)
    {
        const m = (this.to.y - this.from.y) / (this.to.x - this.from.x);
        const q = (-this.from.x) / (this.to.x - this.from.x) * (this.to.y - this.from.y) + this.from.y;

        const x = this.from.x - (distance * (this.from.x - start.x)) / Vec2.distance(this.from, start);
        const y = x * m + q;

        return new Vec2(x, y);
    }
}

