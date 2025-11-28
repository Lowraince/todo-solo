import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { SunIconComponent } from '../../../icons/sun-icon/sun-icon.component';
import { SunsetIconComponent } from '../../../icons/sunset-icon/sunset-icon.component';
import { CalendarMissIconComponent } from '../../../icons/calendar-miss-icon/calendar-miss-icon.component';
import { CalendarIconComponent } from '../../../icons/calendar-icon/calendar-icon.component';
import { SidebarItems } from '../../../interfaces/types';
import { Router } from '@angular/router';
import { RootPages } from '../../../interfaces/enums';

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
  private router = inject(Router);

  public sidebarItems = this.todoState.todoState$.pipe(
    map((state) => state.sidebarItems),
  );

  public activeItem = this.todoState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public changeActiveLink(item: SidebarItems): void {
    this.todoState.changeSidebarItem(item);
    const sidebar = item.toLowerCase();
    console.log('?');
    this.router.navigate([RootPages.MAIN, sidebar]);
  }
}
