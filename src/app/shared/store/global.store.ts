import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { CookieService } from 'ngx-cookie-service';
import { switchMap } from 'rxjs/operators';
import { GtmTrackingService } from '../../chore/services/gtm-tracking.service';
import { LoginSuccessEvent } from '../../chore/tracking/gtm/login-success.event';
import { Credentials } from '../models/credentials';
import { User } from '../models/user';
import { LoginService } from '../services/login.service';

export interface GlobalState {
  currentHarvestId: string;
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
}

const DEFAULT_STATE: GlobalState = {
  currentHarvestId: '',
  isLoggedIn: false,
  user: null,
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class GlobalStore extends ComponentStore<GlobalState> {
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);
  private readonly loginService = inject(LoginService);
  private readonly gtmTracking = inject(GtmTrackingService);
  private readonly cookieService = inject(CookieService);
  private readonly transloco = inject(TranslocoService);

  constructor() {
    super({ ...DEFAULT_STATE, isLoggedIn: false });
  }

  readonly isLoggedIn$ = this.select(({ isLoggedIn }) => isLoggedIn);
  readonly loading$ = this.select(({ loading }) => loading);
  readonly user$ = this.select(({ isLoggedIn, user }) => ({
    ...user,
    isLoggedIn,
  }));

  readonly login = this.effect<Credentials>((trigger$) =>
    trigger$.pipe(
      switchMap((credentials) =>
        this.loginService.login(credentials).pipe(
          tapResponse(
            (response) => {
              this.router.navigate(['/']);
              this.toast.success(this.transloco.translate('login.success'));
              this.setLoggedIn(response);
            },
            (error) => this.toast.error(String(error)),
          ),
        ),
      ),
    ),
  );

  readonly logout = this.updater((state) => {
    this.cookieService.delete('token');

    return { ...state, isLoggedIn: false, user: null };
  });

  readonly setLoggedIn = this.updater(
    (state, { accessToken }: AuthResponse) => {
      const helper = new JwtHelperService();
      const user = helper.decodeToken(accessToken);
      this.gtmTracking.setGlobalProperties({ user });
      this.gtmTracking.track(new LoginSuccessEvent());

      return { ...state, isLoggedIn: !!accessToken, user };
    },
  );

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));
}
