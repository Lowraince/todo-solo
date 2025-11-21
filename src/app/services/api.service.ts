import { inject, Injectable } from '@angular/core';
import {
  GetUserProfile,
  UserLogin,
  UserProfile,
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
    realNameUser,
  }: UserProfile): Observable<GetToken> {
    return this.http.post<GetToken>('api/user/createUser', {
      userName,
      password,
      realNameUser,
    });
  }

  public postLoginUser({
    userName,
    password,
  }: UserLogin): Observable<GetToken> {
    return this.http.post<GetToken>('api/user/login', {
      userName,
      password,
    });
  }

  public getUserProfile(token: string): Observable<GetUserProfile> {
    return this.http.get<GetUserProfile>('api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public getCheckUserName(userName: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`api/user/check`, {
      params: { userName },
    });
  }

  public postDataTodo(data: ITodoAdd): Observable<ITodo> {
    return this.http.post<ITodo>(`api/todos`, data);
  }

  public getDataTodo(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>('api/todos');
  }

  public patchDataTodo(
    idTodo: string,
    update: Partial<ITodo>,
  ): Observable<ITodo> {
    return this.http.patch<ITodo>(`api/todos/${idTodo}`, update);
  }
}
