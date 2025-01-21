import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, catchError, throwError } from 'rxjs';

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

  getArticleById(id: string): Observable<any> {
    return this.http.get(`api/articles/${id}`);
  }

  getReviewsByArticleId(articleId: string): Observable<any[]> {
    return this.http.get<any[]>(`api/articles/${articleId}/reviews`);
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

  addReview(
    articleId: string,
    review: { rating: number; comment: string }
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('currentUser')}`
    );
    console.log('Review payload:', review);

    return this.http
      .post(`api/articles/${articleId}/reviews`, review, {
        headers,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(
            () => new Error('Something went wrong with adding the review.')
          );
        })
      );
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
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      location.reload();
    }
  }
}
