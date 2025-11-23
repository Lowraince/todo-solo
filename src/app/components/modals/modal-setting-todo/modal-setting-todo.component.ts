import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { getPriority } from '../../../utils/get-priority';
import { FlagIconComponent } from '../../../icons/flag-icon/flag-icon.component';
import { PriorityTodos, PriorityType } from '../../../interfaces/enums';
import { NgClass } from '@angular/common';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-setting-todo',
  imports: [FlagIconComponent, NgClass],
  templateUrl: './modal-setting-todo.component.html',
  styleUrl: './modal-setting-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingTodoComponent implements OnInit {
  @Input({ required: true }) public flagActive!: string;
  @Input({ required: true }) public modalActive!: boolean;
  @Input({ required: true }) public description!: string;

  @Output() public changeModalOpen = new EventEmitter<boolean>();
  @Output() public priorityChanged = new EventEmitter<PriorityType>();

  private element = inject(ElementRef);
  private openModalService = inject(ModalsOpenService);
  private destroyRef = inject(DestroyRef);

  private modalConfirm$ = this.openModalService.modalsState$.pipe(
    map((state) => state.confirmModal),
  );

  private modalConfirmIsOpen: boolean = false;

  public priorityArray = getPriority();

  public ngOnInit(): void {
    this.modalConfirm$
      .pipe(
        tap((value) => console.log(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => (this.modalConfirmIsOpen = value));
  }

  @HostListener('document:mousedown', ['$event'])
  public onClickOutside(event: Event): void {
    if (
      !this.element.nativeElement.contains(event.target) &&
      !this.modalConfirmIsOpen
    ) {
      this.changeModalOpen.emit(false);
    }
  }

  public getClassPriority(className: PriorityTodos): string {
    const objectClass = {
      [PriorityTodos.NO_PRIO]: 'no_prio',
      [PriorityTodos.LOW_PRIO]: 'low_prio',
      [PriorityTodos.MEDIUM_PRIO]: 'medium_prio',
      [PriorityTodos.HIGH_PRIO]: 'high_prio',
    };

    return objectClass[className];
  }

  public changePriority(priority: PriorityType): void {
    this.priorityChanged.emit(priority);
  }

  public deleteClickHandler(): void {
    console.log(this.description);
    this.openModalService
      .openConfirmModal(this.description)
      .subscribe((value) => {
        if (value) {
          console.log('yes');
        } else {
          console.log('no');
        }
      });
  }
}
