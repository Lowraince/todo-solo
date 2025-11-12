import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentTodosComponent } from './main-content-todos.component';

describe('MainContentTodosComponent', () => {
  let component: MainContentTodosComponent;
  let fixture: ComponentFixture<MainContentTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentTodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
