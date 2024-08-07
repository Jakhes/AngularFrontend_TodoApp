import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label } from './todo';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.apiServerUrl}/todo/all/label`);
  }

  public addLabel(label: Label): Observable<Label> {
    return this.http.post<Label>(`${this.apiServerUrl}/todo/add/label`, label);
  }

  public updateLabel(label: Label): Observable<Label> {
    return this.http.put<Label>(
      `${this.apiServerUrl}/todo/update/label`,
      label
    );
  }

  public deleteLabel(labelId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/todo/delete/label/${labelId}`
    );
  }
}
