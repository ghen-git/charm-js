import { Vec2 } from "./geometry";

export type AnimationTick = (step: number) => void;
export type StartingPositionGetter = () => Vec2;

export interface Animatable
{
    animationTick: AnimationTick;
    getStartingPos: StartingPositionGetter;
}