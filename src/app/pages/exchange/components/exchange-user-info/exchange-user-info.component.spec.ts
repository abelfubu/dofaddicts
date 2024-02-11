import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeUserInfoComponent } from './exchange-user-info.component';

describe('ExchangeUserInfoComponent', () => {
  let component: ExchangeUserInfoComponent;
  let fixture: ComponentFixture<ExchangeUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeUserInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
