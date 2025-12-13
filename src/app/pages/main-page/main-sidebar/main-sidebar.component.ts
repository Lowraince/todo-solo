import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { SunIconComponent } from '../../../icons/sun-icon/sun-icon.component';
import { SunsetIconComponent } from '../../../icons/sunset-icon/sunset-icon.component';
import { CalendarMissIconComponent } from '../../../icons/calendar-miss-icon/calendar-miss-icon.component';
import { CalendarIconComponent } from '../../../icons/calendar-icon/calendar-icon.component';
import { Router } from '@angular/router';
import { SidebarItemsType } from '../../../interfaces/types';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { RootPages } from '../../../interfaces/enums';
import { AllIconComponent } from '../../../icons/all-icon/all-icon.component';

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
    AllIconComponent,
  ],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSidebarComponent {
  private todoState = inject(TodosService);
  private router = inject(Router);

  public sidebarItems$ = this.todoState.todoState$.pipe(
    map((state) => state.sidebarItems),
  );

  public sidebarStats$ = this.todoState.todoState$.pipe(
    map((state) => state.stats),
  );

  public activeSidebar$ = this.todoState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public sidebarWithStats$ = combineLatest([
    this.sidebarItems$,
    this.sidebarStats$,
  ]).pipe(
    map(([sidebars, stats]) => {
      return sidebars.map((sidebar) => {
        return {
          ...sidebar,
          sidebarStats: stats ? stats[sidebar.title] : 0,
        };
      });
    }),
  );

  public changeActiveLink(sidebar: SidebarItemsType): void {
    this.router.navigate([RootPages.MAIN, sidebar]);
  }
}
