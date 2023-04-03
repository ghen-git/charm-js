import { Animatable } from "./animatable";
import { Vec2 } from "./geometry";

interface Animation
{
    element: Animatable, 
    duration: number;
    secondsElapsed: number;
}

const pipeline: Animation[] = [];

export function animateLinear(element: Animatable, seconds: number)
{    
    pipeline.push({element, duration: seconds * 1000, secondsElapsed: 0.0})
}

let start: number = Date.now();

function animate()
{
    const deltaTime = getDeltaTime();

    for(const animation of pipeline)
    {
        if(animation.secondsElapsed > animation.duration)
            continue;

        const animationStep = (animation.secondsElapsed + deltaTime) / animation.duration / 100;
        animation.element.animationTick(animationStep);
        animation.secondsElapsed += deltaTime;
    }

    requestAnimationFrame(animate);
}

function getDeltaTime()
{
    const current = Date.now();
    const delta = current - start;
    start = current;

    return delta;
}

requestAnimationFrame(animate);