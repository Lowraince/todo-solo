import { PriorityTodos } from '../interfaces/enums';

export function getPriority(): PriorityTodos[] {
  return Object.values(PriorityTodos);
}
