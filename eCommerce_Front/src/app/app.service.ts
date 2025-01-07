import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('currentUser');

      if (!token) {
        return of({ user: null });
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any>('api/me', { headers });
    }
    return of({ user: null });
  }

  addArticle(formData: FormData): Observable<any> {
    return this.http.post('/api/articles', formData);
  }

  deleteArticleById(id: number): Observable<any> {
    return this.http.delete(`/api/articles/${id}`);
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('currentUser');
    }
    return false;
  }

  isAdmin(user: any): boolean {
    if (typeof window !== 'undefined') {
      return user?.role === 'admin';
    }
    return false;
  }
}
