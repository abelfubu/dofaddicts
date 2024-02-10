import { Component, OnInit, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ProfileStore } from '@pages/profile/profile.store';
import { HeaderComponent } from '@shared/ui/header/header.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    DropdownModule,
    HeaderComponent,
    TranslocoModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  template: `
    <app-header />
    <h1>Profile</h1>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" *transloco="let t">
      <label>Email</label>
      <input pInputText type="text" [readonly]="true" formControlName="email" />
      <label>{{ t('profile.gameNick') }}</label>

      <input pInputText type="text" formControlName="nickname" />
      <label>Discord</label>
      <input pInputText type="text" formControlName="discord" />
      <label>{{ t('profile.server') }}</label>
      <p-dropdown
        [options]="store.servers() || []"
        optionLabel="name"
        optionValue="id"
        formControlName="serverId"
      />
      <div class="actions">
        <p-button [disabled]="form.invalid">{{ t('profile.submit') }}</p-button>
        <p-button [routerLink]="['/']">{{ t('profile.back') }}</p-button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      label {
        display: block;
        padding: 1.5rem 0 0.3rem;
      }
      .actions {
        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        padding: 1rem 0;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  protected readonly store = inject(ProfileStore);
  private readonly formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    discord: [''],
    serverId: ['', Validators.required],
    nickname: ['', Validators.required],
  });

  sync = effect(
    () => {
      this.form.patchValue({ ...this.store.profile() }!);
    },
    { allowSignalWrites: true },
  );

  ngOnInit(): void {
    this.store.getData();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.store.update({
      ...this.store.profile(),
      discord: String(this.form.value.discord),
      nickname: String(this.form.value.nickname),
      serverId: String(this.form.value.serverId),
    });
  }
}
