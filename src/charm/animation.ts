import { TimingFunction } from "./animations";
import { Vec2 } from "./geometry";
import { Line } from "./line";
import { getLineTips } from "./parser";

export interface LineAnimation
{
    from: string,
    to: string,
    options?: AnimationOptions
}

export interface AnimationOptions
{
    duration?: number,
    delay?: number,
    timingFunction?: TimingFunction;
    minLength?: number,
    stick?: boolean,
    discard?: boolean
}

const defaultOptions: AnimationOptions = {
    duration: 0.5,
    delay: 0,
    timingFunction: TimingFunction.easeInOut,
    minLength: 10,
    stick: false,
    discard: false
}

export class Animation
{
    element: HTMLElement;
    lineAnimations: LineAnimation[];
    globalOptions: AnimationOptions | undefined;

    constructor(element: HTMLElement, lines: LineAnimation[], options?: AnimationOptions)
    {
        this.element = element;
        this.lineAnimations = lines;
        this.globalOptions = options;

        this.fillGlobalOptions();
        this.fillLineAnimationOptions();
    }

    async animate()
    {
        return new Promise<Line[]>(resolve => this.animatePromise(resolve));
    }

    animatePromise(resolve: (out: Line[] | PromiseLike<Line[]>) => void)
    {
        let longestAnimationPointer: LineAnimation | null = null;
        let longestAnimationLength: number = 0;
        
        for(const animation of this.lineAnimations)
        {
            const animationLength = animation.options!.delay! + animation.options!.duration!;

            if(animationLength > longestAnimationLength)
            {
                longestAnimationLength = animationLength;
                longestAnimationPointer = animation;
            }
        }

        const lines: Line[] = [];

        for(const animation of this.lineAnimations)
        {
            setTimeout(() =>
            {
                const from = getLineTips(animation.from, this.element);
                const to = getLineTips(animation.to, this.element);

                if(!from || !to)
                    resolve(lines);

                const line = new Line(from![0], from![1]);
            
                document.querySelector('#animation-canvas')!.appendChild(line.svg);
            
                const endFrom = animation.options!.stick || this.globalOptions!.stick ? from![0] : to![0];

                if(!animation.options!.discard!)
                    lines.push(line);

                line.animateWithMinLengthA(
                    endFrom,
                    to![1],
                    animation.options!.duration!,
                    animation.options!.minLength!,
                    animation.options!.timingFunction!
                ).then(() =>
                {
                    if(animation.options!.discard)
                        line.svg.remove();

                    if(animation == longestAnimationPointer)
                        resolve(lines);
                });
            }, animation.options!.delay!);
        }
    }

    private fillLineAnimationOptions()
    {
        for(const animation of this.lineAnimations)
        {
            if(!animation.options)
                animation.options = this.globalOptions;

            animation.options = { ...this.globalOptions, ...animation.options };
        }
    }
    
    private fillGlobalOptions()
    {
        if(!this.globalOptions)
        {
            this.globalOptions = defaultOptions;
            return;
        }

        this.globalOptions = { ...defaultOptions, ...this.globalOptions };
    }
}