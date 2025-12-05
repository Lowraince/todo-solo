import { ITodo } from '../services/todos.service';

export function sumMinutes(
  todoList: ITodo[],
  timeDuration: string,
  spent: boolean = false,
): number {
  return todoList.reduce(
    (accumulator, current) =>
      accumulator +
      (spent ? current.timeSpent : current.value) * Number(timeDuration),
    0,
  );
}
