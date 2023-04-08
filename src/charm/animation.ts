import { TimingFunction } from "./animations";
import { Vec2 } from "./geometry";
import { Line } from "./line";

export interface LineAnimation
{
    line: Line,
    endFrom: Vec2,
    endTo: Vec2,
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
    timingFunction: TimingFunction.linear,
    minLength: 10,
    stick: false,
    discard: false
}

export class Animation
{
    lineAnimations: LineAnimation[];
    globalOptions: AnimationOptions | undefined;

    constructor(lines: LineAnimation[], options?: AnimationOptions)
    {
        this.lineAnimations = lines;
        this.globalOptions = options;

        this.fillGlobalOptions();
        this.fillLineAnimationOptions();
    }

    async animate()
    {
        return new Promise<void>(resolve => this.animatePromise(resolve));
    }

    animatePromise(resolve: (out: void | PromiseLike<void>) => void)
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

        for(const animation of this.lineAnimations)
        {
            setTimeout(() =>
            {
                animation.line.animateWithMinLengthA(
                    animation.endFrom,
                    animation.endTo,
                    animation.options!.duration!,
                    animation.options!.minLength!,
                    animation.options!.timingFunction!
                ).then(() =>
                {
                    if(animation.options!.discard)
                        animation.line.svg.remove();

                    if(animation == longestAnimationPointer)
                        resolve();
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