import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectComponent } from '../../select/select.component';
import {
  EmitterSelect,
  SidebarItems,
  ThemeApp,
} from '../../../interfaces/types';
import { TabNavComponent } from '../../tab-nav/tab-nav.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { ModalsOpenService } from '../../../services/modals-open.service';

@Component({
  selector: 'app-modal-settings',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    SelectComponent,
    TabNavComponent,
    CheckboxComponent,
  ],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingsComponent implements OnInit {
  private todoState = inject(TodosService);
  private settingsState = inject(SettingsService);
  private destroyRef = inject(DestroyRef);
  private modalOpenService = inject(ModalsOpenService);

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  public settingsSections = ['General', 'Timer'];
  public activeSection = 'General';

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
    map((state) => state.appThemes.activeTheme),
  );

  public appThemes = this.settingsState.settingsState$.pipe(
    map((state) => state.appThemes.themes ?? []),
  );

  public timer = this.settingsState.settingsState$.pipe(
    map((state) => state.timer),
  );

  public ngOnInit(): void {
    this.initTheme();
    this.initTimer();
  }

  public closeModal(): void {
    this.modalOpenService.closeModal('settingsAppModal');
  }

  public changeNavSettings(item: string): void {
    const findSection = this.settingsSections.includes(item);
    if (findSection) {
      this.activeSection = item;
    }
  }

  private initTheme(): void {
    this.activeTheme
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((theme) => this.themeControl.setValue(theme));
  }

  private initTimer(): void {
    this.timer.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((time) => {
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

  public toggleActiveSidebar({
    title,
    isActive,
  }: {
    title: string;
    isActive: boolean;
  }): void {
    if (this.isSidebarItemsApp(title)) {
      this.todoState.changeVisibleSidebar({ title, isActive });
    }
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

  public onSelectChange2(value: string): void {
    if (this.isThemeApp(value)) {
      this.settingsState.changeTheme(value);
    }
  }

  private isSidebarItemsApp(value: string): value is SidebarItems {
    return (
      value === 'Tomorrow' || value === 'Missed' || value === 'For this week'
    );
  }

  private isThemeApp(value: string): value is ThemeApp {
    return value === 'light' || value === 'dark';
  }
}
