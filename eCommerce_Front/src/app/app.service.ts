import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('currentUser');
    console.log('Token retrieved:', token);

    if (!token) {
      return new Observable<any>();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('api/me', { headers });
  }
}
