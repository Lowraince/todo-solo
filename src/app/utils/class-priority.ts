import { PriorityTodos, PriorityType } from '../interfaces/enums';

export function getClassPriority(className: PriorityType): string {
  const objectClass = {
    [PriorityTodos.NO_PRIO]: 'no_prio',
    [PriorityTodos.LOW_PRIO]: 'low_prio',
    [PriorityTodos.MEDIUM_PRIO]: 'medium_prio',
    [PriorityTodos.HIGH_PRIO]: 'high_prio',
  };

  return objectClass[className] ?? 'no_prio';
}
