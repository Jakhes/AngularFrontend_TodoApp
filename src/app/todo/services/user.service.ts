import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServerUrl = 'https://misty-wildflower-33934.pktriot.net';

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/todo/all/user`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/todo/add/user`, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/todo/update/user`, user);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/todo/delete/user/${userId}`
    );
  }
}
