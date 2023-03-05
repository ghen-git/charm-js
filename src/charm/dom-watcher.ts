const observer = new MutationObserver(onDOMChange);
const elementsInTheLimbo: HTMLElement[] = [];

type ElementAddedCallback = (element: HTMLElement) => void;
const elementAddedCallbacks: ElementAddedCallback[] = [];

export function onElementAdded(callback: ElementAddedCallback)
{
    elementAddedCallbacks.push(callback);
}

addEventListener('load', () =>
{
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
});

function onDOMChange(mutations: MutationRecord[])
{
    mutations.forEach((mutation: MutationRecord) =>
    {
        mutation.addedNodes.forEach(onNodeAdded);
        mutation.removedNodes.forEach(onNodeRemoved);
    });
}

function onNodeAdded(node: Node)
{
    if(node.nodeType != node.ELEMENT_NODE)
        return;

    const element: HTMLElement = node as HTMLElement;

    if(!document.body.contains(element))
    {
        if(!elementsInTheLimbo.includes(element))
        {
            elementsInTheLimbo.push(element);
            console.log(`Element ${element.localName} has entered the limbo`);
        }
        return;
    }
    else
    {
        if(elementsInTheLimbo.includes(element))
        {
            elementsInTheLimbo.splice(elementsInTheLimbo.indexOf(element), 1);
            console.log(`Element ${element.localName} has exited the limbo`);
        }

        elementAddedCallbacks.forEach((callback) => callback(element));
    }
}

function onNodeRemoved(node: Node)
{
    if(node.nodeType != Node.ELEMENT_NODE)
        return;

    const element: HTMLElement = node as HTMLElement;

    if(elementsInTheLimbo.includes(element))
        elementsInTheLimbo.splice(elementsInTheLimbo.indexOf(element), 1);

    console.log(`Element ${element.localName} no longer exists on the material plane`);
}