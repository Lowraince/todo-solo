import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalSettingsService {
  private isOpenModalSettings = new BehaviorSubject<boolean>(false);

  public isOpenModalSettings$ = this.isOpenModalSettings.asObservable();

  public openSettingsModal(): void {
    this.isOpenModalSettings.next(true);
  }

  public closeSettingsModal(): void {
    this.isOpenModalSettings.next(false);
  }
}
