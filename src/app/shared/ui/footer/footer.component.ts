import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ButtonComponent } from '../button/button.component';
import { BuyMeACoffeeComponent } from '../buy-me-coffee.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonComponent, BuyMeACoffeeComponent, TranslocoModule],
  template: `
    <footer *transloco="let t">
      <header>
        <h3>{{ t('footer.title') }}</h3>
        <p>{{ t('footer.text') }}</p>

        <div class="actions">
          <a href="mailto:abelfubu@gmail.com">
            <app-button [center]="true">{{ t('footer.button') }}</app-button>
          </a>

          <app-buy-me-coffee />
        </div>
      </header>
      <hr />
      <p>{{ t('footer.bottom') }}</p>
    </footer>
  `,
  styles: [
    `
      @use 'colors' as colors;

      :host {
        height: 31.25rem;
        display: grid;
        place-content: center;
        text-align: center;

        a {
          text-decoration: none;
          transform: translateY(3px);
        }

        p {
          padding: 2rem 0;
        }

        hr {
          border-color: map-get(colors.$dark, 300);
          margin: 2rem 0 1rem;
        }

        header {
          max-width: 50rem;
          margin: 0 auto;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
      }
    `,
  ],
})
export class FooterComponent {}
