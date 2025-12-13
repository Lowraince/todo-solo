import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentFormInputComponent } from './main-content-form-input.component';

describe('MainContentFormInputComponent', () => {
  let component: MainContentFormInputComponent;
  let fixture: ComponentFixture<MainContentFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentFormInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
