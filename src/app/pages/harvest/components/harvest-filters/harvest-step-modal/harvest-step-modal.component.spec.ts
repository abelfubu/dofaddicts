import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestStepModalComponent } from './harvest-step-modal.component';

describe('HarvestStepModalComponent', () => {
  let component: HarvestStepModalComponent;
  let fixture: ComponentFixture<HarvestStepModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestStepModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestStepModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
