import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ProfileDataService } from '@pages/profile/services/profile-data.service';
import { Server } from '@prisma/client';
import { User } from '@shared/models/user';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface ProfileState {
  profile: User | null;
  servers: Server[];
}

const initialState: ProfileState = {
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

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    profile: computed(() => store.profile()),
    servers: computed(() => store.servers()),
  })),
  withMethods(
    (
      store,
      router = inject(Router),
      toast = inject(HotToastService),
      translate = inject(TranslocoService),
      service = inject(ProfileDataService),
    ) => ({
      updateProfile(profile) {
        patchState(store, { profile });
      },
      getData: rxMethod<void>(
        pipe(
          switchMap(() =>
            service.get().pipe(
              tapResponse(
                ({ profile, servers }) =>
                  patchState(store, { profile, servers }),
                (error) => toast.error(String(error)),
              ),
            ),
          ),
        ),
      ),
      update: rxMethod(
        pipe(
          switchMap((profile) =>
            service.put(profile).pipe(
              tapResponse(
                () => {
                  router.navigate(['/', translate.getActiveLang()]);
                  toast.success('Profile updated');
                },
                (error) => toast.error(String(error)),
              ),
            ),
          ),
        ),
      ),
    }),
  ),
);
