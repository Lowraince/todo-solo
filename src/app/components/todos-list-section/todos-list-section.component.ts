import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITodo } from '../../services/todos.service';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'app-todos-list-section',
  imports: [TodoComponent],
  templateUrl: './todos-list-section.component.html',
  styleUrl: './todos-list-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosListSectionComponent {
  @Input({ required: true }) public todosGroupLength!: number;
  @Input({ required: true }) public todosGroupSectionName!: string;
  @Input({ required: true }) public todosGroupTime!: string;
  @Input({ required: true }) public todosGroup!: ITodo[] | [] | null;
}
