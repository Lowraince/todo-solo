import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalLoadingComponent } from './components/modals/modal-loading/modal-loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalLoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('todo-solo');
}
