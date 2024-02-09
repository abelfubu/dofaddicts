import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Harvest } from '@prisma/client';
import { switchMap } from 'rxjs/operators';
import { ExchangeUser } from './models/exchange.response';
import { ExchangeDataService } from './services/exchange-data.service';

export interface ExchangeState {
  harvest: Record<string, Harvest>;
  users: ExchangeUser[];
  error: boolean;
}

const DEFAULT_STATE: ExchangeState = {
  harvest: {},
  users: [],
  error: false,
};

@Injectable()
export class ExchangeStore extends ComponentStore<ExchangeState> {
  constructor(private readonly service: ExchangeDataService) {
    super(DEFAULT_STATE);
  }

  readonly vm = this.selectSignal((state) => state);

  readonly getUsers = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.service.get().pipe(
          tapResponse(
            ({ harvest, users }) => this.patchState({ harvest, users }),
            (error) => {
              if (error instanceof HttpErrorResponse && error.status === 400)
                this.setError(true);
            },
          ),
        ),
      ),
    ),
  );

  readonly setError = this.updater((state, error: boolean) => ({
    ...state,
    error,
  }));
}
