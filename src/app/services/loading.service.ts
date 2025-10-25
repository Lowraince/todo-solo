import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalLoading } from '../interfaces/interface-modals';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private modal = new BehaviorSubject<ModalLoading>({
    message: '',
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  public loadingModalState$ = this.modal.asObservable();

  public openModal(message: string): void {
    this.modal.next({
      ...this.modal.value,
      message,
      isOpen: true,
      isLoading: true,
    });

    document.body.style.overflow = 'hidden';
  }

  public updateTextModalSuccess(message: string): void {
    const modal = this.modal.value;

    if (modal) {
      this.modal.next({
        ...modal,
        message,
        isLoading: false,
        isSuccess: true,
      });
    }
  }

  public updateTextModalError(message: string): void {
    const modal = this.modal.value;

    if (modal) {
      this.modal.next({
        ...modal,
        message,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }

  public hideModal(): void {
    this.modal.next({
      message: '',
      isOpen: false,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });

    document.body.style.removeProperty('overflow');
  }
}
