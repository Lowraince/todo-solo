import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSettingTodoComponent } from './modal-setting-todo.component';

describe('ModalSettingTodoComponent', () => {
  let component: ModalSettingTodoComponent;
  let fixture: ComponentFixture<ModalSettingTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSettingTodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSettingTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
