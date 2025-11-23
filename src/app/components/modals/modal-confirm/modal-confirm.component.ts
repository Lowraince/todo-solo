import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { AsyncPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-modal-confirm',
  imports: [AsyncPipe, SlicePipe],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmComponent {
  private openModalService = inject(ModalsOpenService);

  public modalCurrentDescription$ = this.openModalService.confirmText$;

  public yesHandler(): void {
    this.openModalService.confirmTrue();
  }

  public noHandler(): void {
    this.openModalService.confirmFalse();
  }
}
