import { Component } from '@angular/core';

@Component({
  selector: 'app-buy-me-coffee',
  standalone: true,
  template: `
    <a href="https://www.buymeacoffee.com/abelfubu" target="_blank" class="bmc-link">
      <img src="./assets/img/bmc-button.png" alt="Buy me a coffee button" />
    </a>
  `,
  styles: [
    `
      :host {
        img {
          height: 2.25rem;
          transform: translateY(3px);
        }
      }
    `,
  ],
})
export class BuyMeACoffeeComponent {}
