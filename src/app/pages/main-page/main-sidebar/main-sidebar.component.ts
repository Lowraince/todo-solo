import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { SunIconComponent } from '../../../icons/sun-icon/sun-icon.component';
import { SunsetIconComponent } from '../../../icons/sunset-icon/sunset-icon.component';
import { CalendarMissIconComponent } from '../../../icons/calendar-miss-icon/calendar-miss-icon.component';
import { CalendarIconComponent } from '../../../icons/calendar-icon/calendar-icon.component';
import { SidebarItems } from '../../../interfaces/types';

@Component({
  selector: 'app-main-sidebar',
  imports: [
    AsyncPipe,
    SunIconComponent,
    SunsetIconComponent,
    CalendarMissIconComponent,
    CalendarIconComponent,
    NgClass,
  ],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSidebarComponent {
  private todoState = inject(TodosService);

  public sidebarItems = this.todoState.todoState$.pipe(
    map((state) => state.sidebarItems),
  );

  public activeItem = this.todoState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public changeActiveLink(item: string): void {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.todoState.changeSidebarItem(item as SidebarItems);
  }
}
