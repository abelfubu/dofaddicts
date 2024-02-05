import { Injectable, inject } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Router } from 'express';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly response = inject(RESPONSE, { optional: true });
  private readonly router = inject(Router);

  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  redirect(url: string, status: number) {
    if (this.isBrowser()) {
      this.router.navigate([url]);
    } else {
      this.response?.redirect(status, url);
    }
  }
}
