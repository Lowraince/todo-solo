import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { ModalsOpenService } from '../../../services/modals-open.service';

@Component({
  selector: 'app-modal-increase',
  imports: [],
  templateUrl: './modal-increase.component.html',
  styleUrl: './modal-increase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalIncreaseComponent {
  private element = inject(ElementRef);
  private openModalState = inject(ModalsOpenService);

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.openModalState.closeModal('increaseModal');
    }
  }
}
