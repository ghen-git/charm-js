import { CharmNode } from "./charm-node";

/**
 * Transforms the element into a Charm Node
 * @param element Either a string that gets parsed to HTML, or an HTMLElement itself
 */
export function charm(element: HTMLElement | string)
{
    let node: CharmNode;

    if(typeof element == 'string')
    {
        const template: HTMLTemplateElement = document.createElement('template');
        element = element.trim();
        template.innerHTML = element;
        const generatedElement = template.content.firstElementChild! as HTMLElement;

        node = new CharmNode(generatedElement);
    }
    else
    {
        node = new CharmNode(element);
    }

    return node;
}

// import { onElementAdded } from "./dom-watcher";

// onElementAdded((element: HTMLElement) =>
// {
    
// });

// function render()
// {

//     requestAnimationFrame(render);
// }

// requestAnimationFrame(render);