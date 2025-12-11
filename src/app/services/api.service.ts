import { inject, Injectable } from '@angular/core';
import {
  GetUserProfile,
  PostCreateUser,
  postLoginUser,
} from '../interfaces/interface-api';
import { Observable } from 'rxjs';
import { GetToken } from '../interfaces/types';
import { HttpClient } from '@angular/common/http';
import { ITodo, ITodoAdd } from './todos.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  public postCreateUser({
    userName,
    password,
    name,
  }: PostCreateUser): Observable<GetToken> {
    return this.http.post<GetToken>('api/user/createUser', {
      userName,
      password,
      name,
    });
  }

  public postLoginUser({
    userName,
    password,
  }: postLoginUser): Observable<GetToken> {
    return this.http.post<GetToken>('api/user/login', {
      userName,
      password,
    });
  }

  public getUserProfile(): Observable<GetUserProfile> {
    return this.http.get<GetUserProfile>('api/user/profile');
  }

  public getCheckUserName(userName: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`api/user/check`, {
      params: { userName },
    });
  }

  public postDataTodo(data: ITodoAdd): Observable<ITodo> {
    return this.http.post<ITodo>(`api/todos`, data);
  }

  public getDataTodo(activeSidebar: string): Observable<ITodo[]> {
    return this.http.get<ITodo[]>('api/todos', {
      params: { filter: activeSidebar },
    });
  }

  public patchDataTodo(
    idTodo: string,
    update: Partial<ITodo>,
  ): Observable<ITodo> {
    return this.http.patch<ITodo>(`api/todos/${idTodo}`, update);
  }

  public deleteDataTodo(idTodo: string): Observable<{ success: true }> {
    return this.http.delete<{ success: true }>(`api/todos/${idTodo}`);
  }

  public getStats(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`api/todos/stats`);
  }
}
