import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AppModals {
  settingsAppModal: boolean;
  increaseModal: boolean;
  settingsTodoModal: boolean;
}

export type ModalName = keyof AppModals;

@Injectable({
  providedIn: 'root',
})
export class ModalsOpenService {
  private modalsState = new BehaviorSubject<AppModals>({
    settingsAppModal: false,
    increaseModal: false,
    settingsTodoModal: false,
  });

  public modalsState$ = this.modalsState.asObservable();

  public openModal(modalName: ModalName): void {
    this.modalsState.next({
      ...this.modalsState.value,
      [modalName]: true,
    });
  }

  public closeModal(modalName: ModalName): void {
    this.modalsState.next({
      ...this.modalsState.value,
      [modalName]: false,
    });
  }
}
