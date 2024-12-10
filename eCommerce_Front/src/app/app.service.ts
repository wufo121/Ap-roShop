import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post('api/login', { email, password });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post('api/register', { email, password });
  }

  getArticles(): Observable<any[]> {
    return this.http.get<any[]>('/api/articles');
  }
}
