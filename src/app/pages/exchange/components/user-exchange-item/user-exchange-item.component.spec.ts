import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExchangeItemComponent } from './user-exchange-item.component';

describe('UserExchangeItemComponent', () => {
  let component: UserExchangeItemComponent;
  let fixture: ComponentFixture<UserExchangeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserExchangeItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserExchangeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
