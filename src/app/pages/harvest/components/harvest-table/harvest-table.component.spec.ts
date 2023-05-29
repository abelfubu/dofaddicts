import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestTableComponent } from './harvest-table.component';

describe('HarvestTableComponent', () => {
  let component: HarvestTableComponent;
  let fixture: ComponentFixture<HarvestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
