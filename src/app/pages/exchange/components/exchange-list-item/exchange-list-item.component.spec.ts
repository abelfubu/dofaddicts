import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeListItemComponent } from './exchange-list-item.component';

describe('ExchangeListItemComponent', () => {
  let component: ExchangeListItemComponent;
  let fixture: ComponentFixture<ExchangeListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
