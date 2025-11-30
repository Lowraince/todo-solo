import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { map, tap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { SunIconComponent } from '../../../icons/sun-icon/sun-icon.component';
import { SunsetIconComponent } from '../../../icons/sunset-icon/sunset-icon.component';
import { CalendarMissIconComponent } from '../../../icons/calendar-miss-icon/calendar-miss-icon.component';
import { CalendarIconComponent } from '../../../icons/calendar-icon/calendar-icon.component';
import { Router } from '@angular/router';
import { SidebarItemsType } from '../../../interfaces/types';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
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
    CapitalizePipe,
  ],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSidebarComponent {
  private todoState = inject(TodosService);
  private router = inject(Router);

  public sidebarItems$ = this.todoState.todoState$.pipe(
    tap((state) => console.log(state.activeSidebarItem, 'items')),
    map((state) => state.sidebarItems),
  );

  public activeSidebar$ = this.todoState.todoState$.pipe(
    tap((state) => console.log(state.activeSidebarItem, 'active')),
    map((state) => state.activeSidebarItem),
  );

  public changeActiveLink(sidebar: SidebarItemsType): void {
    this.router.navigate([RootPages.MAIN, sidebar]);
  }
}
