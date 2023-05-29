import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../services/local-storage.service';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const DFHV_KEY = environment.authKey;
  const localStorageService = inject(LocalStorageService);

  return next(
    request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${localStorageService.get(DFHV_KEY)}`)
        .set('Access-Control-Allow-Origin', environment.baseUrl),
      withCredentials: true,
    }),
  );
}
