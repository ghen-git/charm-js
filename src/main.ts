import { charm } from './charm/charm';
import { sew } from './charm/seams';
import './charm/style.css';

const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

addEventListener('load', () =>
{
    let counter = 1;
    let direction = 'forwards';
    const valueToUpdate = sew(() =>
    {
        if(direction == 'forwards')
            counter+= 0.2;
        else
            counter-= 0.2;
        
        if(counter > 500 || counter < 0)
        {
            direction = direction == 'forwards' ? 'backwards' : 'forwards';
        }

        return counter;
    }, { updateEveryFrame: true });
    const date = sew(() => valueToUpdate());

    const calendar = charm('<div id="calendar" style="font-size: 24pt"></div>');
    const button = charm('<div><button>Add 1</button><button>Remove 1</button></div>');
    const square1 = charm('<div style="background-color: white; width: 2px; height: 2px; margin: 10px"></div>')
    const square2 = charm('<div style="background-color: white; width: 2px; height: 2px; margin: 10px"></div>')

    square1.width(() => date() * 3);
    square2.height(() => date());

    calendar.text(() => date());

    (button.html.children[0] as HTMLElement).onclick = () => {
        valueToUpdate(valueToUpdate() + 1);
    };
    (button.html.children[1] as HTMLElement).onclick = () => {
        valueToUpdate(valueToUpdate() - 1);
    };

    document.body.appendChild(calendar.html);
    document.body.appendChild(button.html);
    document.body.appendChild(square1.html);
    document.body.appendChild(square2.html);
});