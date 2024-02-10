import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { AuthProvider } from '../../shared/models/auth-provider';
import { GOOGLE_BUTTON_CONFIG } from './login-data';

declare var google: GoogleAuth;

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ButtonModule, RouterModule, InputTextModule, ReactiveFormsModule],
  template: `
    <div class="image"></div>
    <main>
      <a [routerLink]="['/']">
        <img src="./assets/img/logo.png" alt="Logo" />
      </a>
      <h1>Log In</h1>
      <div #googleButton class="google-button"></div>
      <p>Or</p>
      <hr />
      <form [formGroup]="form" (ngSubmit)="onLoginSubmit()">
        <input
          pInputText
          type="email"
          formControlName="email"
          placeholder="example@email.com"
        />
        <input pInputText type="password" formControlName="password" />
        <p-button
          label="Sign In"
          icon="pi pi-sign-in"
          [disabled]="form.invalid"
          [outlined]="true"
          styleClass="w-12 text-center"
        ></p-button>
      </form>
    </main>
  `,
})
export class LoginComponent {
  @ViewChild('googleButton', { read: ElementRef, static: true })
  private googleButton!: ElementRef<HTMLDivElement>;

  private readonly globalStore = inject(GlobalStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        ),
      ],
    ],
  });

  ngAfterContentInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.renderGoogleButton();
  }

  onLoginSubmit() {
    if (this.form.invalid) return;

    this.globalStore.login({
      provider: AuthProvider.EMAIL,
      email: String(this.form.value.email),
      password: String(this.form.value.password),
    });
  }

  private renderGoogleButton() {
    setTimeout(() => {
      google?.accounts.id.renderButton(
        this.googleButton.nativeElement,
        GOOGLE_BUTTON_CONFIG,
      );
    }, 500);
  }
}
