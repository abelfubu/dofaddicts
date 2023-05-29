import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';
import { ExchangeResponse } from './models/exchange.response';
import { ExchangeDataService } from './services/exchange-data.service';

export interface ExchangeState {
  users: ExchangeResponse[];
  error: boolean;
}

const DEFAULT_STATE: ExchangeState = {
  users: [],
  error: false,
};

@Injectable()
export class ExchangeStore extends ComponentStore<ExchangeState> {
  constructor(private readonly service: ExchangeDataService) {
    super(DEFAULT_STATE);
  }

  readonly vm$ = this.select((state) => state);

  readonly getUsers = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.service.get().pipe(
          tapResponse(
            (users) => this.addUsers(users),
            (error) => {
              if (error instanceof HttpErrorResponse && error.status === 400)
                this.setError(true);
            },
          ),
        ),
      ),
    ),
  );

  readonly addUsers = this.updater((state, users: ExchangeResponse[]) => ({
    ...state,
    users,
  }));

  readonly setError = this.updater((state, error: boolean) => ({
    ...state,
    error,
  }));
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
