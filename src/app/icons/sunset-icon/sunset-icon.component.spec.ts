import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunsetIconComponent } from './sunset-icon.component';

describe('SunsetIconComponent', () => {
  let component: SunsetIconComponent;
  let fixture: ComponentFixture<SunsetIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SunsetIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SunsetIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
