export class Vec2
{
    x: number
    y: number

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    static distance(v1: Vec2, v2: Vec2)
    {
        return Math.sqrt(Math.pow(v1.x + v2.x, 2) + Math.pow(v1.y + v2.y, 2));
    }
}