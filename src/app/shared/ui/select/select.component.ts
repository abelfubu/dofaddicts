import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { SelectOption } from '@shared/models/select-option.model';
import { InputComponent } from '@shared/ui/input/input.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatMenuModule, InputComponent],
  template: `
    <input
      [mat-menu-trigger-for]="menu"
      [type]="type"
      [formControl]="control"
      [placeholder]="placeholder"
      autocomplete="off"
      readonly
    />

    <mat-menu #menu="matMenu">
      <button *ngFor="let option of options" mat-menu-item>
        <div class="language-flag" (click)="onOptionSelect(option)">
          {{ option.label }}
        </div>
      </button>
    </mat-menu>

    <ng-container *ngIf="control.touched">
      <p *ngIf="control.errors?.['required']">El campo es obligatorio</p>
      <p *ngIf="control.errors?.['email']">Introduce un email válido</p>
      <p *ngIf="control.errors?.[ 'max' ]">
        El campo tiene que tener como mínimo {{ control.errors?.['max'].max }} caracteres
      </p>
      <p *ngIf="control.errors?.['min']">
        El campo tiene que tener como mínimo {{ control.errors?.['min'].min }} caracteres
      </p>
      <p *ngIf="control.errors?.['pattern']">
        La contraseña debe tener como mínimo una letra minúscula, una letra mayúscula y un
        número o un simbolo
      </p>
    </ng-container>
  `,
  styles: [
    `
      @use 'colors' as c;

      :host {
        display: block;
        position: relative;
      }

      $primary: map-get(
        $map: c.$dark,
        $key: 300,
      );

      input {
        color: c.$light;
        padding: 0.33rem 0.7rem;
        border-radius: 0.4rem;
        border: none;
        box-shadow: 0 0 0 1px $primary;
        font-size: 1.2rem;
        outline: none;
        width: 100%;
        background-color: transparent;
        transition: box-shadow 200ms ease-in-out;

        &:focus {
          box-shadow: 0 0 0 2px $primary;
          background-color: transparent;
        }

        &:hover {
          box-shadow: 0 0 0 2px $primary;
        }
      }

      p {
        font-size: 0.7rem;
        position: absolute;
        bottom: -1.3rem;
      }
    `,
  ],
})
export class SelectComponent {
  @Input() control!: FormControl;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() options: SelectOption[] = [];

  onOptionSelect(option: SelectOption): void {
    this.control.setValue(option);
  }
}
