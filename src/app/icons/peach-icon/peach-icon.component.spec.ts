import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeachIconComponent } from './peach-icon.component';

describe('PeachIconComponent', () => {
  let component: PeachIconComponent;
  let fixture: ComponentFixture<PeachIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeachIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeachIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
