import { JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SelectComponent } from '../select/select.component';

@Component({
  standalone: true,
  selector: 'app-language-selector',
  imports: [RouterLink, SelectComponent, JsonPipe],
  template: `
    <div class="language-selector" [class.hidden]="!visible()">
      @for (link of links(); track link.label) {
        <a
          [routerLink]="route() ? ['/', link.lang, route()] : ['/', link.lang]"
          (click)="langChange.emit(link.lang)"
        >
          <img
            src="./assets/flags/{{ link.lang }}.png"
            alt="Language Flag"
            width="24"
            height="24"
          />
          <span>{{ link.label }}</span>
        </a>
      }
    </div>
  `,
  styleUrl: `./language-selector.component.scss`,
})
export class LanguageSelectorComponent {
  @Output() langChange = new EventEmitter<string>();
  visible = input(false);
  path = input.required<string[]>();
  languages = input.required<string[]>();
  currentLang = input.required<string>();

  route = computed(() => (this.path().length ? this.path().join('/') : ''));

  links = computed(() =>
    this.languages().map((lang) => ({
      lang,
      label: lang.toUpperCase(),
      link: ['/', lang, this.path()],
    })),
  );
}
