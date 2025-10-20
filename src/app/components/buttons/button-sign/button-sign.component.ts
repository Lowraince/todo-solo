import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-button-sign',
  imports: [AsyncPipe, NgClass],
  template: `<button
    class="button button__sign"
    type="submit"
    [disabled]="isLoading$ | async"
    [ngClass]="{ button_disabled }"
  >
    <ng-content></ng-content>
  </button>`,
  styleUrl: './button-sign.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSignComponent {
  private authService = inject(AuthService);

  @Input() public button_disabled: boolean = false;

  public isLoading$ = this.authService.authState$.pipe(
    map((state) => state.isLoading),
  );
}
