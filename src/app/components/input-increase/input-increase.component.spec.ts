import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIncreaseComponent } from './input-increase.component';

describe('InputIncreaseComponent', () => {
  let component: InputIncreaseComponent;
  let fixture: ComponentFixture<InputIncreaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputIncreaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
