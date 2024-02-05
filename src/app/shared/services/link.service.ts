import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export interface LinkDefinition {
  id?: string;
  rel?: string;
  href?: string;
  hreflang?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Link {
  private readonly document = inject(DOCUMENT);

  addLink(link: LinkDefinition): HTMLLinkElement {
    const linkElement = this.document.createElement('link');
    this.setAttributes(linkElement, link);
    this.document.head.appendChild(linkElement);
    return linkElement;
  }

  removeLink(attrSelector: string): void {
    const elements = this.document.querySelectorAll(`link[${attrSelector}]`);

    elements.forEach((element) => element.remove());
  }

  updateTag(link: LinkDefinition): HTMLLinkElement {
    const linkElement = this.document.querySelector<HTMLLinkElement>(
      `link[id="${link.id}"]`,
    );

    if (!linkElement) return new HTMLLinkElement();

    this.setAttributes(linkElement, link);
    return linkElement;
  }

  setAttributes(link: HTMLLinkElement, definition: LinkDefinition): void {
    Object.entries(definition).forEach(([key, value]) =>
      link.setAttribute(key, value),
    );
  }
}
