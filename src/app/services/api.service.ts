import { inject, Injectable } from '@angular/core';
import { UserLogin, UserProfile } from '../interfaces/interface-api';
import { Observable } from 'rxjs';
import { GetToken } from '../interfaces/types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  public postCreateUser({
    userName,
    password,
    name,
  }: UserProfile): Observable<GetToken> {
    return this.http.post<GetToken>('api/user/createUser', {
      userName,
      password,
      name,
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

  public getUserProfile(token: string): Observable<UserProfile> {
    return this.http.get<UserProfile>('api/user/profile', {
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
}
