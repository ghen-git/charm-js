export function stringToHTML(html: string)
{
    const template: HTMLTemplateElement = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstElementChild!;
}