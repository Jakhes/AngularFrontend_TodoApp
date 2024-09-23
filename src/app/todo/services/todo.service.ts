import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiServerUrl = 'http://167.172.102.61:8888';

  constructor(private http: HttpClient) {}

  public getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiServerUrl}/todo/all`);
  }

  public addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiServerUrl}/todo/add`, todo);
  }

  public updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiServerUrl}/todo/update`, todo);
  }

  public deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/todo/delete/${todoId}`);
  }
}
