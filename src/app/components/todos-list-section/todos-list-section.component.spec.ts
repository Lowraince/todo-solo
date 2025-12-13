import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosListSectionComponent } from './todos-list-section.component';

describe('TodosListSectionComponent', () => {
  let component: TodosListSectionComponent;
  let fixture: ComponentFixture<TodosListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosListSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
