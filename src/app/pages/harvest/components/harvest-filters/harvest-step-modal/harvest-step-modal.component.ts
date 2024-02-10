import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HarvestStore } from '../../../harvest.store';
import { HarvestSteps } from '../../../models/harvest-steps';

@Component({
  selector: 'app-harvest-step-modal',
  templateUrl: './harvest-step-modal.component.html',
  styleUrls: ['./harvest-step-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CheckboxModule],
})
export class HarvestStepModalComponent {
  form!: FormGroup;
  store!: HarvestStore;
  steps!: boolean[];

  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  ngOnInit(): void {
    this.steps = this.config.data;
    this.initializeStepsForm(this.config.data);
  }

  setAllControls(steps: boolean[], value: boolean): void {
    this.form.setValue(HarvestSteps.mapToFormValue(steps, value));
  }

  applySteps(): void {
    this.dialogRef.close(this.form.value);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  private initializeStepsForm(steps: boolean[]): void {
    this.form = this.formBuilder.group(HarvestSteps.mapToFormGroup(steps));
  }
}
