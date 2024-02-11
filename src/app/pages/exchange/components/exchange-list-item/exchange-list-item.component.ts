import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Harvest } from '@prisma/client';

type Lang = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';

@Component({
  selector: 'app-exchange-list-item',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="grid align-items-center exchange-list-item">
      <div class="col-2">
        <img [ngSrc]="imageSrc()" [alt]="name()" width="60" height="60" />
      </div>
      <p class="col-8">{{ name() }}</p>
      <p class="col-2">{{ item().step }}</p>
    </div>
  `,
})
export class ExchangeListItemComponent {
  private readonly transloco = inject(TranslocoService);
  item = input.required<Harvest>();

  imageSrc = computed(() => this.item().image);
  name = computed(() => {
    const lang = this.transloco.getActiveLang() as Lang;
    return this.item()[lang].name;
  });
}
