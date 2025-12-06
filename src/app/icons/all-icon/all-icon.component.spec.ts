import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIconComponent } from './all-icon.component';

describe('AllIconComponent', () => {
  let component: AllIconComponent;
  let fixture: ComponentFixture<AllIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
