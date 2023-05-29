import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestTableHeaderComponent } from './harvest-table-header.component';

describe('HarvestTableHeaderComponent', () => {
  let component: HarvestTableHeaderComponent;
  let fixture: ComponentFixture<HarvestTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestTableHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
