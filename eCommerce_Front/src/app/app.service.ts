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

    const parsedToken = JSON.parse(token);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${parsedToken}`
    );
    return this.http.get<any>('api/me', { headers });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  addArticle(formData: FormData): Observable<any> {
    return this.http.post('/api/articles', formData);
  }
}
