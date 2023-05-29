import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img:not([loading])',
  standalone: true,
})
export class LazyImagesDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnInit(): void {
    this.renderer.setAttribute(this.el, 'loading', 'lazy');
  }
}
