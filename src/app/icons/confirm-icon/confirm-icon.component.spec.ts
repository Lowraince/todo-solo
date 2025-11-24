import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmIconComponent } from './confirm-icon.component';

describe('ConfirmIconComponent', () => {
  let component: ConfirmIconComponent;
  let fixture: ComponentFixture<ConfirmIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
