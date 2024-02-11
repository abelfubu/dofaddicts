import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { StringUtils } from '@libs/string';
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
import { Server } from '@prisma/client';
import { pipe } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ExchangeWithResponse } from '../../../../server/exchange/models/exchange-with.response';
import { ExchangeUser } from './models/exchange.response';
import { ExchangeDataService } from './services/exchange-data.service';

type Lang = 'es' | 'en' | 'fr';

export interface ExchangeState {
  servers: Record<string, Server>;
  users: ExchangeUser[];
  currentServer: string;
  error: boolean;
  search: string;
  filterCurrentUser: string;
  filterTargetUser: string;
  monsterTypeCurrent: string[];
  monsterTypeTarget: string[];
  currentUser: ExchangeWithResponse['currentUser'] | null;
  targetUser: ExchangeWithResponse['targetUser'] | null;
}

const initialState: ExchangeState = {
  currentUser: null,
  targetUser: null,
  servers: {},
  users: [],
  error: false,
  currentServer: 'all',
  search: '',
  filterCurrentUser: '',
  filterTargetUser: '',
  monsterTypeCurrent: ['0', '1', '2'],
  monsterTypeTarget: ['0', '1', '2'],
};

export const ExchangeStore = signalStore(
  { providedIn: 'root' },
  withState<ExchangeState>(initialState),
  withComputed((state, transloco = inject(TranslocoService)) => ({
    servers: computed(() => state.servers()),
    serverOptions: computed(() => Object.values(state.servers())),
    users: computed(() =>
      StringUtils.filterList(state.users(), state.search(), (user) =>
        String(user.nickname),
      ),
    ),
    error: computed(() => state.error()),
    sourceUserItems: computed(() =>
      StringUtils.filterList(
        state.currentUser()?.repeated || [],
        state.filterCurrentUser(),
        (item) => item[transloco.getActiveLang() as Lang].name,
      ).filter((item) =>
        state.monsterTypeCurrent().includes(String(item.type)),
      ),
    ),
    targetUserItems: computed(() =>
      StringUtils.filterList(
        state.targetUser()?.repeated || [],
        state.filterTargetUser(),
        (item) => item[transloco.getActiveLang() as Lang].name,
      ).filter((item) => state.monsterTypeTarget().includes(String(item.type))),
    ),
    sourceUser: computed(() => ({
      nickname: state.currentUser()?.nickname || '',
      server: state.currentUser()?.server || '',
      discord: state.currentUser()?.discord || '',
    })),
    targetUser: computed(() => ({
      nickname: state.targetUser()?.nickname || '',
      server: state.targetUser()?.server || '',
      discord: state.targetUser()?.discord || '',
    })),
  })),
  withMethods(
    (
      store,
      service = inject(ExchangeDataService),
      toast = inject(HotToastService),
    ) => ({
      getUsers: rxMethod<string>(
        pipe(
          switchMap((server) =>
            service.get(server).pipe(
              tapResponse(
                ({ servers, users, currentServer }) =>
                  patchState(store, (state) => ({
                    ...state,
                    users,
                    servers,
                    currentServer,
                  })),
                (error) => {
                  if (
                    error instanceof HttpErrorResponse &&
                    error.status === 400
                  ) {
                    patchState(store, (state) => ({ ...state, error }));
                  }
                },
              ),
            ),
          ),
        ),
      ),
      search: rxMethod<string>(
        pipe(
          debounceTime(300),
          tap((search) =>
            patchState(store, (state) => ({ ...state, search: search })),
          ),
        ),
      ),
      searchCurrentUser: rxMethod<string>(
        pipe(
          debounceTime(300),
          tap((search) =>
            patchState(store, (state) => ({
              ...state,
              filterCurrentUser: search,
            })),
          ),
        ),
      ),
      searchTargetUser: rxMethod<string>(
        pipe(
          debounceTime(300),
          tap((search) =>
            patchState(store, (state) => ({
              ...state,
              filterTargetUser: search,
            })),
          ),
        ),
      ),
      filterMonsterTypeCurrent: rxMethod<string[]>(
        pipe(
          tap((monsterTypeCurrent) =>
            patchState(store, (state) => ({ ...state, monsterTypeCurrent })),
          ),
        ),
      ),
      filterMonsterTypeTarget: rxMethod<string[]>(
        pipe(
          tap((monsterTypeTarget) =>
            patchState(store, (state) => ({ ...state, monsterTypeTarget })),
          ),
        ),
      ),
      with: rxMethod<string>(
        pipe(
          switchMap((nickname) =>
            service.with(nickname).pipe(
              tapResponse({
                next: ({ currentUser, targetUser }) => {
                  patchState(store, (state) => ({
                    ...state,
                    currentUser,
                    targetUser,
                  }));
                },
                error: (error) => toast.error(String(error)),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
