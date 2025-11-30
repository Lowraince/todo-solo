import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalSettingsComponent } from '../../components/modals/modal-settings/modal-settings.component';
import { AsyncPipe } from '@angular/common';
import { ModalsOpenService } from '../../services/modals-open.service';
import { map } from 'rxjs';
import { ModalConfirmComponent } from '../../components/modals/modal-confirm/modal-confirm.component';
import { RouterOutlet } from '@angular/router';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { HeaderMainComponent } from './main-header/header-main.component';

@Component({
  selector: 'app-main-page',
  imports: [
    ModalSettingsComponent,
    AsyncPipe,
    ModalConfirmComponent,
    RouterOutlet,
    MainSidebarComponent,
    HeaderMainComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  public modalOpenService = inject(ModalsOpenService);

  public modalAppSettings$ = this.modalOpenService.modalsState$.pipe(
    map((state) => state.settingsAppModal),
  );

  public modalConfirm$ = this.modalOpenService.modalsState$.pipe(
    map((state) => state.confirmModal),
  );
}
