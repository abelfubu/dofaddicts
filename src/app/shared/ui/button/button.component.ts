import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [disabled]="disabled()"
      [class.auto]="center()"
      [class.accent]="accent()"
    >
      <span *ngIf="icon()" class="material-symbols-outlined">
        {{ icon() }}
      </span>
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss',
  imports: [CommonModule],
})
export class ButtonComponent {
  icon = input('');
  disabled = input(false);
  center = input(false);
  accent = input(false);
}
