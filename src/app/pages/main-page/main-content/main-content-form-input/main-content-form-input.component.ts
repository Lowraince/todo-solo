import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { PeachIconComponent } from '../../../../icons/peach-icon/peach-icon.component';
import { PlusIconComponent } from '../../../../icons/plus-icon/plus-icon.component';
import { ArrowIconComponent } from '../../../../icons/arrow-icon/arrow-icon.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ModalIncreaseComponent } from '../../../../components/modals/modal-increase/modal-increase.component';
import { ModalsOpenService } from '../../../../services/modals-open.service';
import { BehaviorSubject, exhaustMap, finalize, map, Subject, tap } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { emptyValidator } from '../../../../utils/validators/validator-empty';
import { TodosService } from '../../../../services/todos.service';
import {
  ChangeDirection,
  InputIncreaseComponent,
} from '../../../../components/input-increase/input-increase.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidebarItemsType } from '../../../../interfaces/types';

interface ActiveIcons {
  isHovered: boolean;
  isTarget: boolean;
}

interface ActiveIconsState {
  icons: ActiveIcons[];
  lastIndex: number | null;
}

@Component({
  selector: 'app-main-content-form-input',
  imports: [
    PeachIconComponent,
    PlusIconComponent,
    ArrowIconComponent,
    NgClass,
    ModalIncreaseComponent,
    AsyncPipe,
    ReactiveFormsModule,
    InputIncreaseComponent,
  ],
  templateUrl: './main-content-form-input.component.html',
  styleUrl: './main-content-form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentFormInputComponent implements OnInit {
  private openModalState = inject(ModalsOpenService);
  private todosState = inject(TodosService);
  private activeSidebar: SidebarItemsType | null = null;
  private destroyRef = inject(DestroyRef);

  private addClick$ = new Subject<{
    description: string;
    value: number;
    activeSidebar: SidebarItemsType;
  }>();
  public isLoading$ = new BehaviorSubject(false);

  public ngOnInit(): void {
    this.initActiveSidebar();
    this.onClickAddTodoInit();
  }

  public initActiveSidebar(): void {
    this.todosState.todoState$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((state) => (this.activeSidebar = state.activeSidebarItem)),
      )
      .subscribe();
  }

  public onClickAddTodoInit(): void {
    this.addClick$
      .pipe(
        tap(() => this.isLoading$.next(true)),
        takeUntilDestroyed(this.destroyRef),
        exhaustMap((object) =>
          this.todosState.addTodo(object).pipe(
            tap(() => {
              this.addTodoForm.reset();
              this.resetActiveIconsState();
            }),
            finalize(() => this.isLoading$.next(false)),
          ),
        ),
      )
      .subscribe();
  }

  public modalIncrease = this.openModalState.modalsState$.pipe(
    map((state) => state.increaseModal),
  );

  public activeIconsState: ActiveIconsState = {
    icons: this.iconsCreator(),
    lastIndex: null,
  };

  public addTodoForm = new FormGroup({
    text: new FormControl('', [Validators.required, emptyValidator]),
    values: new FormControl(0, { nonNullable: true }),
  });

  public addTodo(): void {
    const form = this.addTodoForm;

    if (form.invalid) return;

    const text = form.value.text;
    const values = form.value.values;

    if (!text && !values && !this.activeSidebar) return;

    const newTodo = {
      description: text!,
      value: values!,
      activeSidebar: this.activeSidebar!,
    };

    this.addClick$.next(newTodo);
  }

  public onClickIconValue(event: Event, index: number): void {
    event.preventDefault();

    const formValues = this.addTodoForm.controls.values;

    const indexPlusOne = index + 1;

    if (this.isSameIcon(indexPlusOne)) {
      this.clearValues(formValues);
    } else {
      this.setValues(formValues, indexPlusOne);
    }
  }

  public onValueChangeDirection(direction: ChangeDirection): void {
    const formValues = this.addTodoForm.controls.values;

    if (formValues.value < 6 || formValues.value > 0) {
      this.activeIconsState = {
        ...this.activeIconsState,
        lastIndex: formValues.value,
      };
    }

    if (direction === 'plus') {
      if (formValues.value === 1000) return;

      const formValuePlus = formValues.value + 1;

      this.setValues(formValues, formValuePlus);
    } else if (direction === 'minus') {
      if (formValues.value === 0) {
        this.clearValues(formValues);
        return;
      }

      const formValueMinus = formValues.value - 1;

      this.setValues(formValues, formValueMinus);
    }
  }

  public onInputValueChange(input: number): void {
    if (input === 0) {
      this.resetActiveIconsState();
      return;
    }

    if (input < 6 || input > 0) {
      this.setValueIconsState(input);
    }
  }

  public onHoverValues(index: number): void {
    this.setValueIconsHover(index);
  }

  public onMouseLeave(): void {
    this.resetIcons();
  }

  public openIncreaseModal(): void {
    this.openModalState.openModal('increaseModal');
  }

  private clearValues(formValues: FormControl<number>): void {
    this.resetActiveIconsState();

    formValues.setValue(0);
  }

  private setValues(formValues: FormControl<number>, index: number): void {
    this.setValueIconsState(index);

    formValues.setValue(index);
  }

  private resetIcons(): void {
    this.activeIconsState = {
      ...this.activeIconsState,
      icons: this.activeIconsState.icons.map((icon) => ({
        ...icon,
        isHovered: false,
      })),
    };
  }

  private isSameIcon(index: number): boolean {
    return this.activeIconsState.lastIndex === index;
  }

  private iconsCreator(): ActiveIcons[] {
    return Array.from({ length: 5 }, () => ({
      isHovered: false,
      isTarget: false,
    }));
  }

  private resetActiveIconsState(): void {
    this.activeIconsState = {
      icons: this.activeIconsState.icons.map(() => ({
        isHovered: false,
        isTarget: false,
      })),
      lastIndex: null,
    };
  }

  private setValueIconsState(index: number): void {
    this.activeIconsState = {
      icons: this.activeIconsState.icons.map((icon, iconIndex) => ({
        ...icon,
        isTarget: iconIndex <= index - 1,
        isHovered: false,
      })),
      lastIndex: index,
    };
  }

  private setValueIconsHover(index: number): void {
    this.activeIconsState = {
      ...this.activeIconsState,
      icons: this.activeIconsState.icons.map((icon, iconIndex) => ({
        ...icon,
        isHovered: iconIndex <= index,
      })),
    };
  }
}
