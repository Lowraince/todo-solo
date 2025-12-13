import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LogoutIconComponent } from '../../../icons/logout-icon/logout-icon.component';
import { SettingsIconComponent } from '../../../icons/settings-icon/settings-icon.component';
import { AuthService } from '../../../services/auth.service';
import { ModalsOpenService } from '../../../services/modals-open.service';

@Component({
  selector: 'app-header-main',
  imports: [AsyncPipe, SettingsIconComponent, LogoutIconComponent],
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMainComponent {
  private authService = inject(AuthService);
  private modalOpenService = inject(ModalsOpenService);

  public profile$ = this.authService.authState$.pipe(
    map((state) => state.userProfile),
  );

  public ngOnInit(): void {
    this.profile$
      .pipe(
        take(1),
        tap((profile) => {
          if (!profile) {
            this.authService.fetchUserProfile(false).subscribe();
          }
        }),
      )
      .subscribe();
  }

  public openSettingsModal(): void {
    this.modalOpenService.openModal('settingsAppModal');
  }

  public logoutHandler(): void {
    this.authService.logoutUser();
  }
}
