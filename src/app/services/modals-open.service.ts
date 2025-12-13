import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';

interface AppModals {
  settingsAppModal: boolean;
  increaseModal: boolean;
  confirmModal: boolean;
}

export type ModalName = keyof AppModals;

@Injectable({
  providedIn: 'root',
})
export class ModalsOpenService {
  private modalsState = new BehaviorSubject<AppModals>({
    settingsAppModal: false,
    increaseModal: false,
    confirmModal: false,
  });

  private confirmSubject = new Subject<boolean>();
  private confirmText = new BehaviorSubject<string>('');

  public modalsState$ = this.modalsState.asObservable();
  public confirmSubject$ = this.confirmSubject.asObservable();
  public confirmText$ = this.confirmText.asObservable();

  public openConfirmModal(description: string): Observable<boolean> {
    this.openModal('confirmModal');
    this.confirmText.next(description);
    return this.confirmSubject$.pipe(take(1));
  }

  public confirmTrue(): void {
    this.confirmSubject.next(true);
    this.closeModal('confirmModal');
  }

  public confirmFalse(): void {
    this.confirmSubject.next(false);
    this.closeModal('confirmModal');
  }

  public openModal(modalName: ModalName): void {
    this.modalsState.next({
      ...this.modalsState.value,
      [modalName]: true,
    });
    document.body.style.overflow = 'hidden';
  }

  public closeModal(modalName: ModalName): void {
    this.modalsState.next({
      ...this.modalsState.value,
      [modalName]: false,
    });

    document.body.style.removeProperty('overflow');
  }
}
