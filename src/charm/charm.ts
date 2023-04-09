import { CharmNode } from "./charm-node";
import "./svg";
import { onAttributeChanged } from "./dom-watcher";
import { parse } from "./parser";
import { stringToHTML } from "./qol";

onAttributeChanged('charm-', parse);

document.addEventListener('DOMContentLoaded', () =>
{
    document.body.appendChild(stringToHTML('<svg class="fullscreen" id="animation-canvas" xmlns="http://www.w3.org/2000/svg">'));
})

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