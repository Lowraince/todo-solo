import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  SidebarItemsState,
  TodosService,
} from '../../../services/todos.service';
import { map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectComponent } from '../../select/select.component';
import { EmitterSelect } from '../../../interfaces/types';

@Component({
  selector: 'app-modal-settings',
  imports: [AsyncPipe, ReactiveFormsModule, SelectComponent],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingsComponent implements OnInit {
  private todoState = inject(TodosService);
  private settingsState = inject(SettingsService);
  private destroyRef = inject(DestroyRef);

  public settings = ['General', 'Timer'];
  public optionValueTheme = ['light', 'dark'];

  public themeControl = new FormControl<string | null>(null);

  private timerForm = new FormGroup({
    timeDuration: new FormControl<string | null>(null),
    timeRest: new FormControl<string | null>(null),
  });

  public optionValueTimer = [
    {
      label: 'Duration',
      values: this.durationTime(),
      control: this.timerForm.controls.timeDuration,
    },
    {
      label: 'Short Rest',
      values: this.durationTime(),
      control: this.timerForm.controls.timeRest,
    },
  ];

  private durationTime(): string[] {
    const array = [];

    for (let index = 1; index <= 20; index++) {
      array.push(index.toString());
    }
    return array;
  }

  public activeTheme = this.settingsState.settingsState$.pipe(
    map((state) => state.theme),
  );

  public timer = this.settingsState.settingsState$.pipe(
    map((state) => state.timer),
  );

  public ngOnInit(): void {
    this.initTheme();
    this.initTimer();
  }

  private initTheme(): void {
    this.activeTheme
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => console.log('initTheme')),
      )
      .subscribe((theme) => this.themeControl.setValue(theme));
  }

  private initTimer(): void {
    this.timer
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => console.log('initTimer')),
      )
      .subscribe((time) => {
        if (time) {
          this.timerForm.setValue({
            timeDuration: time.timeDuration,
            timeRest: time.timeRest,
          });
        }
      });
  }

  public sidebarItems = this.todoState.todoState$.pipe(
    map((state) => state.sidebarItems.filter((item) => item.title !== 'Today')),
  );

  public toggleActiveSidebar({ title, active }: SidebarItemsState): void {
    console.log(title, active);
    this.todoState.changeVisibleSidebar({ title, active });
  }

  public changeTheme(item: string): void {
    console.log(item);
  }

  public onSelectChange({ control, value }: EmitterSelect): void {
    const timeDuration = this.timerForm.controls.timeDuration;
    const timeRest = this.timerForm.controls.timeRest;

    if (control === timeDuration) {
      this.settingsState.changeTimeDuration(value);
    }
    if (control === timeRest) {
      this.settingsState.changeTimeRest(value);
    }
  }
}
