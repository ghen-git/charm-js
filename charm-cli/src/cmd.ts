let disappearingLines: number = 0;

function removeDisappearing()
{
    process.stdout.moveCursor(0, -disappearingLines);
    process.stdout.clearScreenDown();
}

export function print(text: any)
{
    removeDisappearing();
    console.log(text);
}

export function printDisappearing(text: any)
{
    removeDisappearing();

    console.log(text);

    const linebreaks = text.match(/\n/g);
    const linebreaksCount = linebreaks ? linebreaks.length : 0;
    disappearingLines = linebreaksCount + 1;
}
