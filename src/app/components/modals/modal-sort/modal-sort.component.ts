import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { SortTodos } from '../../../interfaces/types';

@Component({
  selector: 'app-modal-sort',
  imports: [],
  templateUrl: './modal-sort.component.html',
  styleUrl: './modal-sort.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSortComponent {
  private todosState = inject(TodosService);

  public changeSort(sort: SortTodos): void {
    this.todosState.changeSortTodos(sort);
  }
}
