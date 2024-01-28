import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input
      [type]="type()"
      [formControl]="control()"
      [placeholder]="placeholder()"
      autocomplete="off"
      [readonly]="readonly()"
    />

    @if (touched()) {
      @if (required()) {
        <p>El campo es obligatorio</p>
      }

      @if (email()) {
        <p>Introduce un email válido</p>
      }

      @if (max()) {
        <p>El campo tiene que tener como máximo {{ max().max }} caracteres</p>
      }

      @if (min()) {
        <p>El campo tiene que tener como mínimo {{ min().min }} caracteres</p>
      }

      @if (pattern()) {
        <p>
          La contraseña debe tener como mínimo una letra minúscula, una letra
          mayúscula y un número o un simbolo
        </p>
      }
    }
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent {
  control = input.required<FormControl>();
  type = input('text');
  placeholder = input('');
  readonly = input(false);

  touched = computed(() => this.control().touched);
  required = computed(() => this.control().errors?.['required']);
  email = computed(() => this.control().errors?.['email']);
  max = computed(() => this.control().errors?.['max']);
  min = computed(() => this.control().errors?.['min']);
  pattern = computed(() => this.control().errors?.['pattern']);
}
