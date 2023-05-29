import { DOCUMENT } from '@angular/common';
import { Directive, inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthProvider } from './models/auth-provider';
import { GlobalStore } from './store/global.store';

declare var google: GoogleAuth;

@Directive({
  selector: 'app-google-auth',
  standalone: true,
})
export class GoogleAuthDirective implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly globalStore = inject(GlobalStore);

  ngOnInit(): void {
    const script: HTMLScriptElement = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', 'https://accounts.google.com/gsi/client');
    script.setAttribute('defer', '');
    script.setAttribute('async', '');
    script.onload = this.initializeGoogleAuth.bind(this);
    this.renderer.appendChild(this.document.head, script);
  }

  initializeGoogleAuth(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (res) => this.ngZone.run(this.onGoogleLogin, this, [res]),
    });

    // google.accounts.id.prompt();
  }

  onGoogleLogin({ credential }: GoogleAuthResponse): void {
    this.globalStore.login({ provider: AuthProvider.GOOGLE, credential });
  }
}
