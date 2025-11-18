import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteIconComponent } from './complete-icon.component';

describe('CompleteIconComponent', () => {
  let component: CompleteIconComponent;
  let fixture: ComponentFixture<CompleteIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
