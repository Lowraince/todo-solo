import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TodosService } from '../../../services/todos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, filter, map, switchMap, tap } from 'rxjs';
import { RootPages, SidebarItems } from '../../../interfaces/enums';

@Component({
  selector: 'app-main-layout',
  imports: [MainSidebarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  private todosState = inject(TodosService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.initRoute();
  }

  private initRoute(): void {
    this.activatedRoute.firstChild?.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((parameter) => parameter.get('todosDay')),
        tap((day) => {
          if (!day) {
            this.router.navigate([RootPages.MAIN, SidebarItems.TODAY]);
          }

          console.log('initLayout');
        }),
        filter((day): day is string => !!day),
        switchMap((day) => this.todosState.getTodos(day)),
        catchError((error) => {
          console.log(error, 'something wrong');
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
