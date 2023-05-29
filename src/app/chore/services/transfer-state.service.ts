import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  StateKey,
  TransferState,
  inject,
} from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  fetch<T>(
    key: StateKey<T>,
    observableInput: Observable<T>,
    defaultValue: T
  ): Observable<T> {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(key)) {
      return of(this.transferState.get(key, defaultValue)).pipe(
        tap(() => this.transferState.remove(key))
      );
    }

    return observableInput.pipe(
      tap((value) => this.transferState.set(key, value))
    );
  }
}
