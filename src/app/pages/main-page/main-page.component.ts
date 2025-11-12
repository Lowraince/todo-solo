import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ModalSettingsComponent } from '../../components/modals/modal-settings/modal-settings.component';
import { AsyncPipe } from '@angular/common';
import { HeaderMainComponent } from './main-header/header-main.component';
import { ModalsOpenService } from '../../services/modals-open.service';
import { map } from 'rxjs';

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
  public modalOpenService = inject(ModalsOpenService);

  public modalAppSettings = this.modalOpenService.modalsState$.pipe(
    map((state) => state.settingsAppModal),
  );

  public ngOnInit(): void {
    this.authService.initProfile();
  }
}
