import { FormControl } from '@angular/forms';
import {
  AppThemes,
  ButtonsTodoSettings,
  PriorityTodos,
  SettingsItems,
  SidebarItems,
  SortItems,
} from './enums';
import { ITodo } from '../services/todos.service';

export type GetToken = {
  token: string;
};

export type PasswordFieldType = 'password' | 'text';

export type EmitterSelect = {
  control: FormControl;
  value: string | AppThemesType;
};

export type DateGroupMapSort = {
  date: string;
  todos: ITodo[];
};

export type DateGroupSort = {
  date: string;
  todos: ITodo[];
  time: string;
};

export type SortItemsType = `${SortItems}`;

export type SidebarItemsType = `${SidebarItems}`;

export type PriorityType = `${PriorityTodos}`;

export type SettingsItemsType = `${SettingsItems}`;

export type ButtonsTodoSettingsType = `${ButtonsTodoSettings}`;

export type AppThemesType = `${AppThemes}`;
