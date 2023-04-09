import { Animatable } from "./animatable";
import { animate, TimingFunction } from "./animations";
import { Vec2 } from "./geometry";

export class Line implements Animatable
{
    svg: SVGElement;
    from: Vec2;
    to: Vec2;
    length: number;

    private animStartFrom: Vec2;
    private animStartTo: Vec2;
    private animEndFrom: Vec2;
    private animEndTo: Vec2;

    private animationDelay: number = 0;

    constructor(from?: Vec2, to?: Vec2)
    {
        if(!from)
            from = Vec2.zero;

        if(!to)
            to = Vec2.zero;

        this.from = from.clone();
        this.to = to.clone();

        this.animStartFrom = from.clone();
        this.animStartTo = to.clone();

        this.animEndFrom = from.clone();
        this.animEndTo = to.clone();

        this.length = Vec2.distance(from, to);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.svg.setAttribute('x1', from.x.toString());
        this.svg.setAttribute('y1', from.y.toString());
        this.svg.setAttribute('x2', to.x.toString());
        this.svg.setAttribute('y2', to.y.toString());
        this.svg.setAttribute('stroke', '#e1e1e1');
        this.svg.setAttribute('stroke-width', '1px');

        // document.querySelector('svg')!.appendChild(this.svg);
    }

    snapEnd()
    {
        this.to.x = this.animEndTo.x;
        this.to.y = this.animEndTo.y;

        this.updateElement();
    }


    animate(from: Vec2, to: Vec2, duration: number, delay: number = 0, timingFunction: TimingFunction = TimingFunction.linear)
    {
        this.addToQueue(() => this.animateA(from, to, duration, delay, timingFunction));

        return this;
    }

    animateWithMinLength(from: Vec2, to: Vec2, duration: number, minLength: number = 0, timingFunction: TimingFunction = TimingFunction.linear)
    {
        this.addToQueue(() => this.animateWithMinLengthA(from, to, duration, minLength, timingFunction));

        return this;
    }

    /**
     * idk what the fuck this is
     * please dont judge me
     */
    private queuedAnimations: Function[] = [];
    private async dispatchQueue()
    {
        while(this.queuedAnimations.length > 0)
        {
            await this.queuedAnimations[0]();
            this.queuedAnimations.splice(0, 1);
        }
    }

    private addToQueue(f: Function)
    {
        this.queuedAnimations.push(f);
        
        if(this.queuedAnimations.length == 1)
            this.dispatchQueue();
    }


    animateA(from: Vec2, to: Vec2, duration: number, delay: number = 0, timingFunction: TimingFunction = TimingFunction.linear)
    {
        this.animStartFrom.copy(this.from);
        this.animStartTo.copy(this.to);

        this.animEndFrom.copy(from);
        this.animEndTo.copy(to);

        this.animationDelay = delay / duration;
    
        return animate(this, duration, delay, timingFunction);
    }

    animateWithMinLengthA(from: Vec2, to: Vec2, duration: number, minLength: number = 0, timingFunction: TimingFunction = TimingFunction.linear)
    {
        const length = Vec2.distance(this.to, to);
        const delay = (minLength / length) * duration;
        
        return this.animateA(from, to, duration, delay, timingFunction);
    }

    animationTick(step: number)
    {
        const fromStep = step - this.animationDelay;

        if(fromStep > 0 && fromStep < 1)
        {
            this.from.x = (1 - fromStep) * this.animStartFrom.x + fromStep * this.animEndFrom.x;
            this.from.y = (1 - fromStep) * this.animStartFrom.y + fromStep * this.animEndFrom.y;
        }
        if(step < 1)
        {
            this.to.x = (1 - step) * this.animStartTo.x + step * this.animEndTo.x;
            this.to.y = (1 - step) * this.animStartTo.y + step * this.animEndTo.y;
        }

        this.updateElement();
    }

    endAnimation()
    {
        this.from.x = this.animEndFrom.x;
        this.from.y = this.animEndFrom.y;
        this.to.x = this.animEndTo.x;
        this.to.y = this.animEndTo.y

        this.updateElement();
    }

    updateElement()
    {
        this.svg.setAttribute('x1', this.from.x.toString());
        this.svg.setAttribute('y1', this.from.y.toString());
        this.svg.setAttribute('x2', this.to.x.toString());
        this.svg.setAttribute('y2', this.to.y.toString());
    }
}

