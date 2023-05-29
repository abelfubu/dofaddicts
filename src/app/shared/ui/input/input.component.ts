import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() readonly = false;
}
