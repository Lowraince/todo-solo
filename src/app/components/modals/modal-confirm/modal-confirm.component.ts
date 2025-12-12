import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { AsyncPipe } from '@angular/common';
import { SliceModalDescriptionPipe } from '../../../pipes/slice-modal-description.pipe';
import { ConfirmIconComponent } from '../../../icons/confirm-icon/confirm-icon.component';

@Component({
  selector: 'app-modal-confirm',
  imports: [AsyncPipe, SliceModalDescriptionPipe, ConfirmIconComponent],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmComponent {
  private openModalService = inject(ModalsOpenService);

  @Output() public closeSettings = new EventEmitter();

  public modalCurrentDescription$ = this.openModalService.confirmText$;

  public yesHandler(): void {
    this.openModalService.confirmTrue();
    this.closeSettings.emit();
  }

  public noHandler(): void {
    this.openModalService.confirmFalse();
  }
}
