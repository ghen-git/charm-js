export class Vec2
{
    x: number
    y: number

    public static zero = new Vec2(0, 0);

    constructor(x: number, y?: number)
    {
        this.x = x;
        
        if(y == undefined)
            this.y = x;
        else    
            this.y = y;
    }

    static distance(v1: Vec2, v2: Vec2)
    {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }

    clone()
    {
        return new Vec2(this.x, this.y);
    }

    copy(v: Vec2)
    {
        this.x = v.x;
        this.y = v.y;
    }

    plus(v: Vec2)
    {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    minus(v: Vec2)
    {
        v = v.times(-1);
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    times(k: number)
    {
        return new Vec2(this.x * k, this.y * k);
    }
}