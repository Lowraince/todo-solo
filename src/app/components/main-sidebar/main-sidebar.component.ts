import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main-sidebar',
  imports: [AsyncPipe],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSidebarComponent {
  private todoState = inject(TodosService);

  public sidebarItems = this.todoState.todoState$.pipe(
    map((state) => state.sidebarItems),
  );
}
