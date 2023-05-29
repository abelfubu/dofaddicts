import { CommonModule, NgForOf } from '@angular/common';
import {
  Component,
  EventEmitter,
  InjectionToken,
  Output,
  inject,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Observable, map, switchMap } from 'rxjs';

import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { environment } from '@environments/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GlobalStore } from '../../store/global.store';
import { ButtonComponent } from '../button/button.component';
import { BuyMeACoffeeComponent } from '../buy-me-coffee.component';

interface HeaderViewModel {
  isLoggedIn: boolean;
  email: string;
  picture: string;
  lang: string;
  languages: string[];
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
    MatProgressBarModule,
    BuyMeACoffeeComponent,
  ],
  providers: [
    {
      provide: HEADER_VM,
      useFactory: (global: GlobalStore, translate: TranslocoService) =>
        translate.langChanges$.pipe(
          switchMap(() =>
            global.user$.pipe(
              map((user) => ({
                ...user,
                lang: translate.getActiveLang(),
                languages: translate.getAvailableLangs(),
              })),
            ),
          ),
        ),
      deps: [GlobalStore, TranslocoService],
    },
  ],
})
export class HeaderComponent {
  @Output() logout = new EventEmitter();

  protected readonly vm$ = inject(HEADER_VM);
  protected readonly translate = inject(TranslocoService);
  protected readonly store = inject(GlobalStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly localStorage = inject(LocalStorageService);

  selectedLanguage = signal<string>(this.translate.getActiveLang());

  onLangChange(lang: string): void {
    this.localStorage.set(environment.favLangKey, lang);
    this.selectedLanguage.set(lang);
    this.router.navigate([lang, ...this.route.snapshot.url.map((u) => u.path)]);
  }

  onLogout(): void {
    this.logout.emit();
    this.store.logout();
  }
}
