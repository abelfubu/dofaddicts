import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { GlobalStore } from '../store/global.store';

export function loadingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (request.url.split('.').at(-1) === 'json') return next(request);

  const store = inject(GlobalStore);
  store.setLoading(true);

  return next(request).pipe(finalize(() => store.setLoading(false)));
}
