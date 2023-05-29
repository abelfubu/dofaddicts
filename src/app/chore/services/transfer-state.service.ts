import { Injectable, StateKey, TransferState, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly transferState = inject(TransferState);

  fetch<T>(
    key: StateKey<T>,
    observableInput: Observable<T>,
    defaultValue: T,
  ): Observable<T> {
    if (!this.transferState.hasKey(key)) {
      return observableInput.pipe(tap((value) => this.transferState.set(key, value)));
    }

    return of(this.transferState.get(key, defaultValue)).pipe(
      tap(console.log),
      tap(() => this.transferState.remove(key)),
    );
  }
}
