import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  standalone: true,
  selector: 'app-language-selector',
  imports: [RouterLink, JsonPipe, DropdownModule, FormsModule, UpperCasePipe],
  template: `
    <p-dropdown
      [options]="languages()"
      [ngModel]="currentLang()"
      (onChange)="langChange.emit($event.value)"
      class="p-inputtext-sm"
    >
      <ng-template pTemplate="selectedItem">
        @if (currentLang()) {
          <div class="flex align-items-center gap-2">
            <img
              src="./assets/flags/{{ currentLang() }}.png"
              alt="Language Flag"
              width="24"
              height="24"
            />
            <span>{{ currentLang() | uppercase }}</span>
          </div>
        }
      </ng-template>
      <ng-template let-lang pTemplate="item">
        <div class="flex align-items-center gap-2">
          <img
            src="assets/flags/{{ lang.value }}.png"
            alt="Language Flag"
            width="24"
            height="24"
          />
          <div>{{ lang.label }}</div>
        </div>
      </ng-template>
    </p-dropdown>
  `,
})
export class LanguageSelectorComponent {
  @Output() langChange = new EventEmitter<string>();
  languages = input.required<string[]>();
  currentLang = input.required<string>();
}
