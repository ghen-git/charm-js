import { Seam, createAttributeSeam } from "./seams";

export class CharmNode 
{
    /** the vanilla HTML element representation of the node. Should be used for vanilla interactions with the node, such as appending it to the DOM */
    html: HTMLElement;
    
    textSeam: Seam<string> | undefined;
    widthSeam: Seam<number> | undefined;
    heightSeam: Seam<number> | undefined;

    constructor(element: HTMLElement) 
    {
        this.html = element;
    }

    text = createAttributeSeam
    (
        () => this.html.textContent,
        (v) => this.html.textContent = v,
        (v) => this.textSeam = v as Seam<string>
    );

    width = createAttributeSeam
    (
        () => this.html.getBoundingClientRect().width,
        (v) => this.html.style.width = v + 'px',
        (v) => this.widthSeam = v as Seam<number>
    );

    height = createAttributeSeam
    (
        () => this.html.getBoundingClientRect().height,
        (v) => this.html.style.height = v + 'px',
        (v) => this.heightSeam = v as Seam<number>
    );
}