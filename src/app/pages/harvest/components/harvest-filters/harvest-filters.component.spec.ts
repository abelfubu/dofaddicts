import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestFiltersComponent } from './harvest-filters.component';

describe('HarvestFiltersComponent', () => {
  let component: HarvestFiltersComponent;
  let fixture: ComponentFixture<HarvestFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
