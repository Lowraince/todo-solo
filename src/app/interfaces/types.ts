import { FormControl } from '@angular/forms';

export type GetToken = {
  token: string;
};

export type PasswordFieldType = 'password' | 'text';

export type SidebarItems = 'Today' | 'Tomorrow' | 'Missed' | 'For this week';

export type ThemeApp = 'light' | 'dark';

export type EmitterSelect = {
  control: FormControl;
  value: string | ThemeApp;
};
