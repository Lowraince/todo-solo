import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, map, tap } from 'rxjs';
import { SortItemsType } from '../../../interfaces/types';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-sort',
  imports: [NgClass, AsyncPipe],
  templateUrl: './modal-sort.component.html',
  styleUrl: './modal-sort.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSortComponent implements OnInit {
  private todosState = inject(TodosService);
  private destroyRef = inject(DestroyRef);
  private element = inject(ElementRef);

  @Output() public closeModal = new EventEmitter<boolean>();

  @HostListener('document:mousedown', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.closeModal.emit(false);
    }
  }

  private todosSortItems$ = this.todosState.todoState$.pipe(
    map((state) => state.sortingItems),
  );

  public todosActiveSort$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSort),
  );

  public todosActiveSidebar$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public filteredSortItems$ = combineLatest([
    this.todosSortItems$,
    this.todosActiveSidebar$,
  ]).pipe(
    map(([sortItems, activeSidebar]) => {
      return activeSidebar === 'for this week' ||
        activeSidebar === 'all tasks' ||
        activeSidebar === 'missed'
        ? sortItems
        : sortItems.filter((item) => item.sorting !== 'date_order');
    }),
  );

  public sortControl = new FormControl('');

  public ngOnInit(): void {
    this.initSortValue();
  }

  private initSortValue(): void {
    this.todosState.todoState$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((state) => {
          this.sortControl.setValue(state.activeSort);
        }),
      )
      .subscribe();
  }

  public changeSort(sort: SortItemsType): void {
    console.log(sort, 'click');
    this.todosState.changeSortTodos(sort);
  }
}
