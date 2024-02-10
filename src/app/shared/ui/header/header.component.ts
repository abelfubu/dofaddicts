import { CommonModule, NgForOf } from '@angular/common';
import {
  Component,
  EventEmitter,
  InjectionToken,
  Output,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Observable, map, switchMap } from 'rxjs';

import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { GlobalStore } from '../../store/global.store';
import { ButtonComponent } from '../button/button.component';
import { BuyMeACoffeeComponent } from '../buy-me-coffee.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

interface HeaderViewModel {
  isLoggedIn: boolean;
  email: string;
  picture: string;
  lang: string;
  languages: string[];
  path: string[];
}

const HEADER_VM = new InjectionToken<Observable<HeaderViewModel>>('HEADER_VM');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    CommonModule,
    RouterLink,
    MatMenuModule,
    ButtonComponent,
    TranslocoModule,
    RouterLinkActive,
    BuyMeACoffeeComponent,
    ProgressSpinnerModule,
    LanguageSelectorComponent,
  ],
  providers: [
    {
      provide: HEADER_VM,
      useFactory: (
        global: GlobalStore,
        translate: TranslocoService,
        route: ActivatedRoute,
      ) =>
        translate.langChanges$.pipe(
          switchMap(() =>
            global.user$.pipe(
              map((user) => ({
                ...user,
                lang: translate.getActiveLang(),
                languages: translate.getAvailableLangs(),
                path: route.snapshot.url.map((u) => u.path),
              })),
            ),
          ),
        ),
      deps: [GlobalStore, TranslocoService, ActivatedRoute],
    },
  ],
})
export class HeaderComponent {
  @Output() logout = new EventEmitter();

  protected readonly vm$ = inject(HEADER_VM);
  protected readonly translate = inject(TranslocoService);
  protected readonly store = inject(GlobalStore);
  private readonly cookieService = inject(CookieService);

  selectedLanguage = signal<string>(this.translate.getActiveLang());
  languageSelectorVisible = signal(false);

  onLangChange(lang: string): void {
    this.languageSelectorVisible.set(false);
    this.cookieService.set(environment.favLangKey, lang);
    this.selectedLanguage.set(lang);
  }

  onLogout(): void {
    this.store.logout();
    this.logout.emit();
  }
}
