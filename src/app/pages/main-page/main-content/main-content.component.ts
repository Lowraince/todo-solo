import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SortIconComponent } from '../../../icons/sort-icon/sort-icon.component';
import { MainContentStatisticComponent } from './main-content-statistic/main-content-statistic.component';
import { MainContentFormInputComponent } from './main-content-form-input/main-content-form-input.component';
import { MainContentTodosComponent } from './main-content-todos/main-content-todos.component';
import { ModalErrorComponent } from '../../../components/modals/modal-error/modal-error.component';
import { ActivatedRoute } from '@angular/router';
import { SidebarItemsType } from '../../../interfaces/types';

@Component({
  selector: 'app-main-content',
  imports: [
    AsyncPipe,
    SortIconComponent,
    MainContentStatisticComponent,
    MainContentFormInputComponent,
    MainContentTodosComponent,
    ModalErrorComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentComponent {
  private todoState = inject(TodosService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public todoActiveLink$ = this.todoState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public todoComplete$ = this.todoState.todoState$.pipe(
    map((state) => state.todos.filter((todo) => todo.isComplete).length),
  );

  public todoErrors$ = this.todoState.todoState$.pipe(
    map((state) => state.errorMessages),
  );

  public ngOnInit(): void {
    this.initGetTodos();
  }

  private initGetTodos(): void {
    this.route.paramMap
      .pipe(
        tap((parameterMap) => console.log(parameterMap)),
        map((parameterMap) => parameterMap.get('todosDay')),
        filter((day): day is SidebarItemsType => day !== null),
        switchMap((day) => this.todoState.getTodos(day)),
      )
      .subscribe();
  }
}
