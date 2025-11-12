import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncreaseComponent } from './modal-increase.component';

describe('ModalIncreaseComponent', () => {
  let component: ModalIncreaseComponent;
  let fixture: ComponentFixture<ModalIncreaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalIncreaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
