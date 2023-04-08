interface SeamOptions
{
    updateMillis?: number
    updateEveryFrame?: boolean
}
export type Seam<T> = (value?: T | SeamValue<T>, update?: boolean) => T;
export type SeamValue<T> = () => T;

export type AttributeSetter<T> = (value: T) => void;
export type AttributeGetter<T> = () => T;
export type AttributeSeamSetter<T> = (seam: Seam<T>) => void;

const seamsToResolve: Seam<any>[] = [];

export function sew<T>(startValue: T | SeamValue<T>, options?: SeamOptions)
{
    const boundSeams: Seam<any>[] = [];

    const newSeam: Seam<T> = (value?: T | SeamValue<T>, update?: boolean) =>
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
            startValue = value!;

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

export function createAttributeSeam<T>(getter: AttributeGetter<T>, 
                                       setter: AttributeSetter<T>, 
                                       seamSetter: AttributeSeamSetter<T>)
{
    return (attribute?: T | SeamValue<T>) =>
    {
        if(!attribute)
            return getter();
    
        if(typeof attribute != 'function')
        {
            setter(attribute);
            return; 
        }

        seamSetter(sew(() =>
        {
            const value = (attribute as SeamValue<T>)();
            setter(value);
            return value;
        }));

        return getter();
    }
}

function updateInnerSeams(boundSeams: Seam<any>[])
{
    boundSeams.forEach((innerSeam) =>
    {
        updateSeam(innerSeam);
    });
}

function loopSeam<T>(func: Seam<T>, everyMillis: number)
{
    setTimeout(() =>
    {
        updateSeam(func);
        loopSeam(func, everyMillis);
    }, everyMillis);
}

function updateSeam<T>(func: Seam<T>)
{
    func(undefined, true);
}

function getValue<T>(value: T | SeamValue<T>)
{
    if(typeof value == 'function')
        return (value as SeamValue<T>)();
    else
        return value;
}
