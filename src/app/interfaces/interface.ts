import { SortItems, SortTitles } from './enums';
import { PriorityType, SidebarItemsType, SortItemsType } from './types';

export interface SidebarItemsState {
  title: SidebarItemsType;
  isActive: boolean;
}

export interface SortItemsState {
  title: SortTitles;
  sorting: SortItems;
}

export interface ITodo {
  idTodo: string;
  value: number;
  valueComplete: number;
  description: string;
  timeToCreate: string;
  isComplete: boolean;
  priority: PriorityType;
  timeSpent: number;
}

export interface TodosState {
  sidebarItems: SidebarItemsState[];
  sortingItems: SortItemsState[];
  todos: ITodo[];
  activeSidebarItem: SidebarItemsType | null;
  activeSort: SortItemsType;
  errorMessages: string[];
  stats: Record<SidebarItemsType, number> | null;
}
