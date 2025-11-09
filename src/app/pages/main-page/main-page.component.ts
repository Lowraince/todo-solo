import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { HeaderMainComponent } from '../../components/header-main/header-main.component';
import { AuthService } from '../../services/auth.service';
import { MainLayoutComponent } from '../../components/main-layout/main-layout.component';
import { ModalSettingsComponent } from '../../components/modals/modal-settings/modal-settings.component';
import { ModalSettingsService } from '../../components/modals/modal-settings/settings-service/modal-settings.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [
    HeaderMainComponent,
    MainLayoutComponent,
    ModalSettingsComponent,
    AsyncPipe,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  private authService = inject(AuthService);
  public modalSettingsService = inject(ModalSettingsService);

  public ngOnInit(): void {
    this.authService.initProfile();
  }
}
