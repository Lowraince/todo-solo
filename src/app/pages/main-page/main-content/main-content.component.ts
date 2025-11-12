import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SortIconComponent } from '../../../icons/sort-icon/sort-icon.component';
import { MainContentStatisticComponent } from './main-content-statistic/main-content-statistic.component';
import { MainContentFormInputComponent } from './main-content-form-input/main-content-form-input.component';
import { MainContentTodosComponent } from './main-content-todos/main-content-todos.component';

@Component({
  selector: 'app-main-content',
  imports: [
    AsyncPipe,
    SortIconComponent,
    MainContentStatisticComponent,
    MainContentFormInputComponent,
    MainContentTodosComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentComponent {
  private todoState = inject(TodosService);

  public todoActiveLink = this.todoState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );
}
