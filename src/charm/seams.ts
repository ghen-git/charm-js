interface SeamOptions
{
    updateMillis?: number
    updateEveryFrame?: boolean
}
export type Seam = (value?: any, update?: boolean) => any;
export type SeamValue = () => any;

export function sew(startValue: any | SeamValue, options?: SeamOptions)
{
    const boundSeams: Seam[] = [];

    const newSeam: Seam = (value?: any, update?: boolean) =>
    {
        if(seamsToResolve.length > 0)
        {
            boundSeams.push(seamsToResolve[seamsToResolve.length - 1]);
        }

        if(update)
        {
            updateInnerSeams(boundSeams);
            return getValue(startValue);
        }

        const isSetOperation = value != undefined ? true : false;

        if(isSetOperation)
        {
            startValue = value;

            seamsToResolve.push(newSeam);
            getValue(startValue);
            seamsToResolve.pop();

            updateInnerSeams(boundSeams);
        }

        return getValue(startValue);
    };

    newSeam(startValue);

    if(options)
    {
        if(options.updateMillis || options.updateEveryFrame)
        {
            const millis = options.updateMillis ? options.updateMillis : 0;
            loopSeam(newSeam, millis);
        }
    }

    return newSeam;
}

function updateInnerSeams(boundSeams: Seam[])
{
    boundSeams.forEach((innerSeam) =>
    {
        updateSeam(innerSeam);
    });
}

function loopSeam(func: Seam, everyMillis: number)
{
    setTimeout(() =>
    {
        updateSeam(func);
        loopSeam(func, everyMillis);
    }, everyMillis);
}

function updateSeam(func: Seam)
{
    func(null, true);
}

function getValue(value: any)
{
    if(typeof value == 'function')
        return value();
    else
        return value;
}

const seamsToResolve: Seam[] = [];
