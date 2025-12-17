import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { map, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TodoComponent } from '../../components/todo/todo.component';
import { SidebarItems } from '../../interfaces/enums';
import { TimerComponent } from '../../components/timer/timer.component';
import { SettingsService } from '../../services/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-timer-page',
  imports: [AsyncPipe, TodoComponent, TimerComponent],
  templateUrl: './timer-page.component.html',
  styleUrl: './timer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPageComponent implements OnInit {
  private timerState = inject(TimerService);
  private settingsState = inject(SettingsService);
  private destroy = inject(DestroyRef);

  private settingTimer = this.settingsState.settingsState$.pipe(
    map((state) => state.timer),
  );

  public todosTimer$ = this.timerState.timerState$.pipe(
    map((state) => state.todos),
  );

  public ngOnInit(): void {
    this.timerState.loadTodos(SidebarItems.TODAY).subscribe();
    this.initTimer().subscribe();
  }

  public isActiveTask$ = this.timerState.timerState$.pipe(
    map((state) => state.activeTodo),
  );

  private initTimer(): Observable<{ timeDuration: string; timeRest: string }> {
    return this.settingTimer.pipe(
      takeUntilDestroyed(this.destroy),
      tap((timer) => {
        this.timerState.addTime(timer.timeRest, timer.timeDuration);
      }),
    );
  }
}
