import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ProfileDataService } from '@pages/profile/services/profile-data.service';
import { Server } from '@prisma/client';
import { User } from '@shared/models/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface ProfileState {
  profile: User | null;
  servers: Server[];
}

const DEFAULT_STATE: ProfileState = {
  profile: {
    email: '',
    discord: '',
    serverId: '',
    picture: '',
    activeAt: '',
    nickname: '',
  },
  servers: [],
};

@Injectable()
export class ProfileStore extends ComponentStore<ProfileState> {
  private readonly toast = inject(HotToastService);
  private readonly dataService = inject(ProfileDataService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslocoService);

  constructor() {
    super(DEFAULT_STATE);
  }

  readonly vm$ = this.select((state) => state);

  readonly getData = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.dataService.get().pipe(
          tapResponse(
            ({ profile, servers }) => this.patchState({ profile, servers }),
            (error) => this.toast.error(String(error)),
          ),
        ),
      ),
    ),
  );

  readonly update = this.effect((profile$: Observable<Partial<User>>) =>
    profile$.pipe(
      switchMap((profile) =>
        this.dataService.put(profile).pipe(
          tapResponse(
            () => {
              this.router.navigate(['/', this.translate.getActiveLang()]);
              this.toast.success('Profile updated');
            },
            (error) => this.toast.error(String(error)),
          ),
        ),
      ),
    ),
  );
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
