import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSortComponent } from './modal-sort.component';

describe('ModalSortComponent', () => {
  let component: ModalSortComponent;
  let fixture: ComponentFixture<ModalSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
