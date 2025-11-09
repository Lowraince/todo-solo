import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsIconComponent } from '../../icons/settings-icon/settings-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon/logout-icon.component';
import { ModalSettingsService } from '../modals/modal-settings/settings-service/modal-settings.service';

@Component({
  selector: 'app-header-main',
  imports: [AsyncPipe, SettingsIconComponent, LogoutIconComponent],
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMainComponent {
  private authService = inject(AuthService);
  public modalSettingsService = inject(ModalSettingsService);

  public profile$ = this.authService.authState$.pipe(
    map((state) => state.userProfile),
  );

  public openSettingsModal(): void {
    this.modalSettingsService.openSettingsModal();
  }

  public logoutHandler(): void {
    this.authService.logoutUser();
  }
}
