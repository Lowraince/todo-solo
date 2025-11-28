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
import { filter, map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITodo, TodosService } from '../../../services/todos.service';
import { getClassPriority } from '../../../utils/class-priority';

@Component({
  selector: 'app-modal-setting-todo',
  imports: [FlagIconComponent, NgClass],
  templateUrl: './modal-setting-todo.component.html',
  styleUrl: './modal-setting-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingTodoComponent implements OnInit {
  @Input({ required: true }) public todo!: ITodo;
  @Input({ required: true }) public modalActive!: boolean;

  @Output() public changeModalOpen = new EventEmitter<boolean>();
  @Output() public priorityChanged = new EventEmitter<PriorityType>();

  private element = inject(ElementRef);
  private openModalService = inject(ModalsOpenService);
  private todosState = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  private modalConfirm$ = this.openModalService.modalsState$.pipe(
    map((state) => state.confirmModal),
  );

  private modalConfirmIsOpen: boolean = false;

  public priorityArray = getPriority();

  public ngOnInit(): void {
    this.modalConfirm$
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  public changePriority(priority: PriorityType): void {
    this.priorityChanged.emit(priority);
  }

  public deleteClickHandler(): void {
    this.openModalService
      .openConfirmModal(this.todo.description)
      .pipe(
        filter(Boolean),
        switchMap(() => this.todosState.deleteTodo(this.todo.idTodo)),
      )
      .subscribe();
  }

  public getClassPriority(priority: PriorityTodos): string {
    return getClassPriority(priority);
  }
}
