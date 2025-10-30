import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsIconComponent } from '../../icons/settings-icon/settings-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon/logout-icon.component';

@Component({
  selector: 'app-header-main',
  imports: [AsyncPipe, SettingsIconComponent, LogoutIconComponent],
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMainComponent {
  private authService = inject(AuthService);

  public profile$ = this.authService.authState$.pipe(
    map((state) => state.userProfile),
  );

  public logoutHandler(): void {
    this.authService.logoutUser();
  }
}
