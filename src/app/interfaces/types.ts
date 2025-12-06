import { FormControl } from '@angular/forms';
import { PriorityTodos, SettingsItems, SidebarItems, SortItems } from './enums';

export type GetToken = {
  token: string;
};

export type PasswordFieldType = 'password' | 'text';

export type ThemeApp = 'light' | 'dark';

export type EmitterSelect = {
  control: FormControl;
  value: string | ThemeApp;
};

export type SortItemsType = `${SortItems}`;

export type SidebarItemsType = `${SidebarItems}`;

export type PriorityType = `${PriorityTodos}`;

export type SettingsItemsType = `${SettingsItems}`;
