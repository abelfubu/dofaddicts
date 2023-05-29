import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-scroll-up',
  standalone: true,
  imports: [],
  template: `<button #scrollBtn (click)="scrollToTop()">
    <span class="material-symbols-outlined"> arrow_upward </span>
  </button>`,
  styles: [
    `
      @use 'common' as common;
      @use 'colors' as colors;

      :host {
        position: fixed;
        bottom: 2rem;
        right: 2rem;

        button {
          background-color: map-get($map: colors.$dark, $key: 400);
          color: colors.$light;
          visibility: hidden;
          transition: visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: 0;
          border: none;
          width: 3rem;
          height: 3rem;
          display: grid;
          place-content: center;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: common.border-shadow(map-get(colors.$dark, 300));

          &.active {
            visibility: visible;
            opacity: 1;
          }

          &:hover {
            box-shadow: common.border-shadow-hover(map-get(colors.$dark, 300));
          }
        }
      }
    `,
  ],
})
export class ScrollUpComponent {
  @ViewChild('scrollBtn') scrollUpBtn!: ElementRef<HTMLButtonElement>;

  private readonly document = inject(DOCUMENT);

  @HostListener('window:scroll') onScroll(): void {
    if (
      this.document.body.scrollTop > 20 ||
      this.document.documentElement.scrollTop > 20
    ) {
      this.scrollUpBtn.nativeElement.classList.add('active');
    } else {
      this.scrollUpBtn.nativeElement.classList.remove('active');
    }
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
