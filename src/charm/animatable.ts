export type AnimationTick = (step: number) => void;
export type EndAnimation = () => void;
export type SnapEnd = () => void;

export interface Animatable
{
    animationTick: AnimationTick;
    endAnimation: EndAnimation;
    snapEnd: SnapEnd;
}