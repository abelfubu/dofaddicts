import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { StringUtils } from '@libs/string';
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
import { ExchangeUser } from './models/exchange.response';
import { ExchangeDataService } from './services/exchange-data.service';

export interface ExchangeState {
  servers: Record<string, Server>;
  users: ExchangeUser[];
  currentServer: string;
  error: boolean;
  search: string;
}

const initialState: ExchangeState = {
  servers: {},
  users: [],
  error: false,
  currentServer: 'all',
  search: '',
};

export const ExchangeStore = signalStore(
  { providedIn: 'root' },
  withState<ExchangeState>(initialState),
  withComputed((state) => ({
    servers: computed(() => state.servers()),
    serverOptions: computed(() => Object.values(state.servers())),
    users: computed(() =>
      StringUtils.filterList(state.users(), state.search(), (user) =>
        String(user.nickname),
      ),
    ),
    error: computed(() => state.error()),
  })),
  withMethods((store, service = inject(ExchangeDataService)) => ({
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
  })),
);
