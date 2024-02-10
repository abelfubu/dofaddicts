import { NgForOf } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ProfileStore } from '@pages/profile/profile.store';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { HeaderComponent } from '@shared/ui/header/header.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { DropdownModule } from 'primeng/dropdown';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    InputComponent,
    DropdownModule,
    ButtonComponent,
    HeaderComponent,
    TranslocoModule,
    ReactiveFormsModule,
  ],
  providers: [ProfileStore],
  template: `
    <app-header />
    <h1>Profile</h1>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" *transloco="let t">
      <label>Email</label>
      <app-input [readonly]="true" [control]="form.controls.email"></app-input>
      <label>{{ t('profile.gameNick') }}</label>
      <app-input [control]="form.controls.nickname"></app-input>
      <label>Discord</label>
      <app-input [control]="form.controls.discord"></app-input>
      <label>{{ t('profile.server') }}</label>
      <p-dropdown [options]="vm()?.servers || []" formControlName="server" />
      <div class="actions">
        <app-button [disabled]="form.invalid">{{
          t('profile.submit')
        }}</app-button>
        <app-button [routerLink]="['/']">{{ t('profile.back') }}</app-button>
      </div>
    </form>
  `,
  styles: [
    `
      label {
        display: block;
        padding: 1.5rem 0 0.3rem;
      }

      app-button {
        display: block;
        padding: 1rem 0;
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
  private readonly store = inject(ProfileStore);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly vm = toSignal(
    this.store.vm$.pipe(
      map((state) => ({
        profile: state.profile,
        servers: state.servers.map((server) => new Server(server)),
      })),
    ),
  );

  protected form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    discord: [''],
    server: [new Server(), Validators.required],
    nickname: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.form.setValue({
        email: this.vm()?.profile?.email || '',
        discord: this.vm()?.profile?.discord || '',
        nickname: this.vm()?.profile?.nickname || '',
        server:
          this.vm()?.servers.find(
            (server) => server.value === this.vm()?.profile?.serverId,
          ) || null,
      });
    });
  }

  ngOnInit(): void {
    this.store.getData();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.store.update({
      ...this.vm()?.profile,
      discord: String(this.form.value.discord),
      nickname: String(this.form.value.nickname),
      serverId: String(this.form.value.server?.value),
    });
  }

  onServerSelect(server: Server): void {
    this.form.controls.server.setValue(server);
  }
}

class Server {
  label: string;
  value: string;

  constructor(server?: any) {
    this.value = server?.id || '';
    this.label = server?.name || '';
  }

  toString(): string {
    return this.label;
  }
}
