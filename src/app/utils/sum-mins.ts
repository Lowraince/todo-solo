import { ITodo } from '../interfaces/interface';

export function sumMinutes(
  todoList: ITodo[],
  timeDuration: string,
  spent: boolean = false,
): number {
  const [hour] = timeDuration.split(':');

  return todoList.reduce(
    (accumulator, current) =>
      accumulator + (spent ? current.timeSpent : current.value) * Number(hour),
    0,
  );
}
