import { sew, SeamValue } from "./seams";

export class CharmNode 
{
    /** the vanilla HTML element representation of the node. Should be used for vanilla interactions with the node, such as appending it to the DOM */
    html: HTMLElement;
    textSetter: Function | undefined;
    widthSetter: Function | undefined;
    heightSetter: Function | undefined;

    constructor(element: HTMLElement) 
    {
        this.html = element;
    }

    text(text?: string | SeamValue)
    {
        if(text)
        {
            if(typeof text == 'string')
            {
                this.html.textContent = text;
                return;
            }
            else
            {
                this.textSetter = sew(() =>
                {
                    const value = text();
                    this.html.textContent = value;
                    return value;
                });
            }
        }

        return this.html.textContent;
    }

    width(width?: number | SeamValue)
    {
        if(width)
        {
            if(typeof width == 'number')
            {
                this.html.style.width = width + 'px';
                return;
            }
            else
            {
                this.widthSetter = sew(() =>
                {
                    const value = width();
                    this.html.style.width = value + 'px';
                    return value;
                });
            }
        }

        return this.html.getBoundingClientRect().width;
    }

    height(height?: number | SeamValue)
    {
        if(height)
        {
            if(typeof height == 'number')
            {
                this.html.style.height = height + 'px';
                return;
            }
            else
            {
                this.heightSetter = sew(() =>
                {
                    const value = height();
                    this.html.style.height = value + 'px';
                    return value;
                });
            }
        }

        return this.html.getBoundingClientRect().height;
    }
}