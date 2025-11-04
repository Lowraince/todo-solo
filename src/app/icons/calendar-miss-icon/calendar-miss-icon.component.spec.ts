import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMissIconComponent } from './calendar-miss-icon.component';

describe('CalendarMissIconComponent', () => {
  let component: CalendarMissIconComponent;
  let fixture: ComponentFixture<CalendarMissIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMissIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarMissIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
