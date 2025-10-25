import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { AsyncPipe } from '@angular/common';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';

@Component({
  selector: 'app-modal-loading',
  imports: [AsyncPipe, CapitalizePipe],
  templateUrl: './modal-loading.component.html',
  styleUrl: './modal-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLoadingComponent {
  public loadingService = inject(LoadingService);

  public modal$ = this.loadingService.loadingModalState$;
}
