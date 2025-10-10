import { inject, Injectable } from '@angular/core';
import { UserProfile } from '../interfaces/interface-api';
import { Observable } from 'rxjs';
import { GetToken } from '../interfaces/types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  public postUser({
    userName,
    password,
    name,
  }: UserProfile): Observable<GetToken> {
    return this.http.post<GetToken>(
      'http://localhost:3004/api/user/createUser',
      {
        userName,
        password,
        name,
      },
    );
  }

  public getUserProfile(token: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      'http://localhost:3004/api/user/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  public checkUserName(userName: string): Observable<{ exists: boolean }> {
    console.log(userName);
    return this.http.get<{ exists: boolean }>(
      `http://localhost:3004/api/user/check`,
      {
        params: { userName },
      },
    );
  }
}
