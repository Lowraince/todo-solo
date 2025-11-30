import { FormControl } from '@angular/forms';
import { PriorityTodos, SidebarItems } from './enums';

export type GetToken = {
  token: string;
};

export type PasswordFieldType = 'password' | 'text';

export type ThemeApp = 'light' | 'dark';

export type EmitterSelect = {
  control: FormControl;
  value: string | ThemeApp;
};

export type SortTodos = 'project_order' | 'priority_order';

export type SidebarItemsType = `${SidebarItems}`;

export type PriorityType = `${PriorityTodos}`;
