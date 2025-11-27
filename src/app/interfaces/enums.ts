export enum RootPages {
  REGISTRATION = 'registration',
  LOGIN = 'login',
  MAIN = 'main',
  TIMER = 'timer',
}

export enum PriorityTodos {
  NO_PRIO = 'No priority',
  LOW_PRIO = 'Low priority',
  MEDIUM_PRIO = 'Medium priority',
  HIGH_PRIO = 'High priority',
}

export enum SidebarItems {
  TODAY = 'Today',
  TOMORROW = 'Tomorrow',
  MISSED = 'Missed',
  FOR_WEEK = 'For this week',
}

export type SidebarItemsType = `${SidebarItems}`;

export type PriorityType = `${PriorityTodos}`;
