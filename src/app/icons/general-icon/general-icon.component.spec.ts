import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralIconComponent } from './general-icon.component';

describe('GeneralIconComponent', () => {
  let component: GeneralIconComponent;
  let fixture: ComponentFixture<GeneralIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
