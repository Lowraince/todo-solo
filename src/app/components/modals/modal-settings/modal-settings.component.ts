import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { map, Observable, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectComponent } from '../../select/select.component';
import {
  AppThemesType,
  EmitterSelect,
  SidebarItemsType,
} from '../../../interfaces/types';
import { TabNavComponent } from '../../tab-nav/tab-nav.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { Router } from '@angular/router';
import {
  RootPages,
  SettingsItems,
  SidebarItems,
} from '../../../interfaces/enums';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-modal-settings',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    SelectComponent,
    TabNavComponent,
    CheckboxComponent,
    CapitalizePipe,
  ],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingsComponent implements OnInit {
  private todosState = inject(TodosService);
  private settingsState = inject(SettingsService);
  private destroyRef = inject(DestroyRef);
  private modalOpenService = inject(ModalsOpenService);
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  public settingsSections = [SettingsItems.GENERAL, SettingsItems.TIMER];
  public activeSection = SettingsItems.GENERAL;

  public themeControl = new FormControl<AppThemesType | null>(null);

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

  public activeTheme$ = this.settingsState.settingsState$.pipe(
    map((state) => state.appThemes.activeTheme),
  );

  public appThemes$ = this.settingsState.settingsState$.pipe(
    map((state) => state.appThemes.themes),
  );

  public timer$ = this.settingsState.settingsState$.pipe(
    map((state) => state.timer),
  );

  public activeSidebar$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public ngOnInit(): void {
    this.initTheme().subscribe();
    this.initTimer();
  }

  public closeModal(): void {
    this.modalOpenService.closeModal('settingsAppModal');
  }

  public changeNavSettings(item: SettingsItems): void {
    this.activeSection = item;
  }

  private initTheme(): Observable<AppThemesType> {
    return this.activeTheme$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((theme) => {
        const themeLocal = this.localStorage.getAppThemeLocalStorage();

        if (this.isAppThemeType(themeLocal)) {
          this.themeControl.setValue(themeLocal);
        } else {
          this.themeControl.setValue(theme);
        }
      }),
    );
  }

  private initTimer(): void {
    this.timer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((time) => {
      if (time) {
        this.timerForm.setValue({
          timeDuration: time.timeDuration,
          timeRest: time.timeRest,
        });
      }
    });
  }

  public sidebarItems = this.todosState.todoState$.pipe(
    map((state) => state.sidebarItems.filter((item) => item.title !== 'today')),
  );

  public toggleActiveSidebar({
    title,
    isActive,
  }: {
    title: SidebarItemsType;
    isActive: boolean;
  }): void {
    this.activeSidebar$
      .pipe(
        take(1),
        tap((activeSidebar) => {
          if (activeSidebar === title) {
            this.router.navigate([RootPages.MAIN, SidebarItems.TODAY]);
          }
        }),
      )
      .subscribe();

    this.todosState.changeVisibleSidebar({ title, isActive });
  }

  public changeTheme(theme: AppThemesType): void {
    this.localStorage.setAppThemeLocalStorage(theme);
    this.themeControl.setValue(theme);
    this.settingsState.changeTheme(theme);
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

  private isAppThemeType(value: string | null): value is AppThemesType {
    return value === 'light' || value === 'dark' || value === 'auto';
  }
}
