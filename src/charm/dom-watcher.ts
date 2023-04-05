const observer = new MutationObserver(onDOMChange);
const elementsInTheLimbo: HTMLElement[] = [];

type ElementAddedCallback = (element: HTMLElement) => void;
type attrChangedCallback = (element: HTMLElement, value: string, fullName: string) => void;
const elementAddedCallbacks: ElementAddedCallback[] = [];
const attrChangedCallbacks = new Map<string, attrChangedCallback>();

export function onElementAdded(callback: ElementAddedCallback)
{
    elementAddedCallbacks.push(callback);
}

export function onAttributeChanged(attribute: string, callback: attrChangedCallback)
{
    attrChangedCallbacks.set(attribute, callback);
}

addEventListener('load', () =>
{
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});

addEventListener('DOMContentLoaded', () =>
{
    document.querySelectorAll('body *').forEach(onNodeAdded);
});

function onDOMChange(mutations: MutationRecord[])
{
    mutations.forEach((mutation: MutationRecord) =>
    {
        mutation.addedNodes.forEach(onNodeAdded);
        mutation.removedNodes.forEach(onNodeRemoved);
        
        if(mutation.attributeName)
            attributeChanged(mutation)
    });
}

function attributeChanged(mutation: MutationRecord)
{
    const element = mutation.target! as HTMLElement;
    const attribute = mutation.attributeName!;

    findAttributeCallback(element, attribute);

}

function findAttributeCallback(element: HTMLElement, attribute: string)
{
    for(const key of attrChangedCallbacks.keys())
    {
        if(attribute.includes(key))
        {
            attrChangedCallbacks.get(key)!(element, element.getAttribute(attribute)!, attribute);
            break;
        }
    }
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

        for(const attribute of element.getAttributeNames())
            findAttributeCallback(element, attribute);

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