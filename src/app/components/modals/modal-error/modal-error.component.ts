import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-error',
  imports: [],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalErrorComponent {
  @Input({ required: true }) public text!: string;
}
