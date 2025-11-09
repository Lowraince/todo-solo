import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIconComponent } from './time-icon.component';

describe('TimeIconComponent', () => {
  let component: TimeIconComponent;
  let fixture: ComponentFixture<TimeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
