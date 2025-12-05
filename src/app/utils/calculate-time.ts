import { ITodo } from '../services/todos.service';
import { sumMinutes } from './sum-mins';

export function calculateTime(todoList: ITodo[], timeDuration: string): string {
  const minsSum = sumMinutes(todoList, timeDuration);
  const hours = Math.floor(minsSum / 60);
  const minutes = minsSum % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
