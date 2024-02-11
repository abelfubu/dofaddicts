import { Component, inject, input } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TooltipModule } from 'primeng/tooltip';
import { from } from 'rxjs';

@Component({
  selector: 'app-exchange-user-info',
  standalone: true,
  imports: [TooltipModule],
  template: `
    <div class="flex justify-content-between align-items-center">
      <h2
        pTooltip="/w {{ user().nickname }}"
        tooltipStyleClass="tooltip"
        class="m-0 text-white cursor-pointer hover:text-primary-600 inline"
        (click)="copyToClipboard(); $event.stopPropagation()"
      >
        {{ user().nickname }}
      </h2>
      <small class="text-primary-400 text-bold">{{ user().server }}</small>
    </div>
    <small class="block">Discord</small>
    <p class="m-0 text-primary-400">
      {{ user().discord || '-' }}
    </p>
  `,
  styles: ``,
})
export class ExchangeUserInfoComponent {
  private readonly toast = inject(HotToastService);
  user = input.required<{
    nickname: string;
    server: string;
    discord: string;
  }>();

  copyToClipboard(): void {
    from(navigator.clipboard.writeText(`/w ${this.user().nickname} `))
      .pipe(
        // 11/02/2024
        // TODO: translate this
        this.toast.observe({
          loading: 'Copiando url en el portapapeles',
          success: 'Comando copiado en el portapapeles',
          error: 'Algo ha ido mal, intentalo más tarde',
        }),
      )
      .subscribe();
  }
}
