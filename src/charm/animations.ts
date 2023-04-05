import { Animatable } from "./animatable";

interface Animation
{
    element: Animatable, 
    duration: number;
    durationWithDelay: number;
    secondsElapsed: number;
    timingFunction: Function | null;
    callback: Function;
}

export enum TimingFunction
{
    linear = 0,
    easeIn,
    easeOut,
    easeInOut
}

const timingFunctions = 
[
    null,
    easeIn,
    easeOut,
    easeInOut
]

const pipeline: Animation[] = [];

export function animate(element: Animatable, seconds: number, delay: number, timingFunction: TimingFunction = TimingFunction.linear)
{    
    return new Promise(resolve =>
    {    
        pipeline.push({
            element,
            duration: seconds * 1000,
            durationWithDelay: (seconds + delay) * 1000,
            secondsElapsed: 0,
            timingFunction: timingFunctions[timingFunction],
            callback: resolve
        });
    })

}

let start: number = Date.now();

function tick()
{
    const deltaTime = getDeltaTime()

    for(const animation of pipeline)
    {   
        if(animation.secondsElapsed > animation.durationWithDelay)
        {
            animation.element.endAnimation();
            animation.callback();
            pipeline.splice(pipeline.indexOf(animation), 1);
            continue;
        }

        if(animation.secondsElapsed + deltaTime >= animation.duration && animation.secondsElapsed < animation.duration)
        {
            animation.element.snapEnd();
            animation.secondsElapsed += deltaTime;
            continue;
        }

        let t = animation.secondsElapsed / animation.duration;

        if(t < 1 && animation.timingFunction)
            t = animation.timingFunction(t);

        animation.element.animationTick(t);
        animation.secondsElapsed += deltaTime;
    }

    requestAnimationFrame(tick);
}

function getDeltaTime()
{
    const current = Date.now();
    const delta = current - start;
    start = current;

    return delta;
}

function easeIn(t: number)
{
    return t*t;
}

function easeOut(t: number)
{
    return 1 - (t - 1)*(t - 1);
}

function easeInOut(t: number)
{
    return t * t * (3 - 2*t);
}

requestAnimationFrame(tick);