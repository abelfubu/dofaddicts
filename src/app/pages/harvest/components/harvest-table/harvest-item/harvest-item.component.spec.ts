import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestItemComponent } from './harvest-item.component';

describe('HarvestItemComponent', () => {
  let component: HarvestItemComponent;
  let fixture: ComponentFixture<HarvestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
