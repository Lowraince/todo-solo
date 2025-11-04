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
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-settings',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingsComponent implements OnInit {
  private todoState = inject(TodosService);
  private settingsState = inject(SettingsService);
  private destroyRef = inject(DestroyRef);

  public activeTheme = this.settingsState.settingsState$.pipe(
    map((state) => state.theme),
  );

  public themeControl = new FormControl('');

  public settings = ['General', 'Timer'];

  public ngOnInit(): void {
    this.initTheme();
    this.listenThemeChange();
  }

  private initTheme(): void {
    this.activeTheme
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((theme) => this.themeControl.setValue(theme));
  }

  private listenThemeChange(): void {
    this.themeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((theme) => {
        if (theme) {
          console.log(theme, 'subscribe');
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
}
