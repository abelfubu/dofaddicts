import { Component } from '@angular/core';

@Component({
  selector: 'app-buy-me-coffee',
  standalone: true,
  template: `
    <a
      href="https://www.buymeacoffee.com/abelfubu"
      target="_blank"
      class="bmc-link"
    >
      <img
        src="./assets/img/bmc-button.png"
        alt="Buy me a coffee button"
        [height]="42"
      />
    </a>
  `,
  styles: [
    `
      :host {
        img {
          transform: translateY(3px);
        }
      }
    `,
  ],
})
export class BuyMeACoffeeComponent {}
