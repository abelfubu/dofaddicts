import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeListHeaderComponent } from './exchange-list-header.component';

describe('ExchangeListHeaderComponent', () => {
  let component: ExchangeListHeaderComponent;
  let fixture: ComponentFixture<ExchangeListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeListHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
