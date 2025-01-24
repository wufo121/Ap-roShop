import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, catchError, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private cartListSubject = new BehaviorSubject<any[]>([]);
  cartList$ = this.cartListSubject.asObservable();
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

  getRatingByArticleId(articleId: string): Observable<number[]> {
    return this.http.get<number[]>(`api/articles/${articleId}/rating`);
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

  addToCart(productId: string, quantity: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('currentUser')}`
    );

    return this.http
      .post('api/cart', { productId, quantity }, { headers })
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

  getCartList(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('currentUser')}`
    );
    return this.http.get('api/cart', { headers });
  }
  updateCartList(): void {
    this.getCartList().subscribe({
      next: (response) => {
        this.cartListSubject.next(response.data);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du panier :', err);
      },
    });
  }
  deleteAndRemoveFromCart(productId: string): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('currentUser')}`
    );

    this.http
      .delete(`api/cart/${productId}`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de la suppression du produit :', error);
          return throwError(
            () =>
              new Error(
                'Une erreur est survenue lors de la suppression du produit.'
              )
          );
        })
      )
      .subscribe({
        next: () => {
          const updatedCart = this.cartListSubject.value.filter(
            (item) => item.productId !== productId
          );
          this.cartListSubject.next(updatedCart);

          console.log('Produit supprimé avec succès du panier');
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de l'article :", err);
        },
      });
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

  getRatingCounts(ratings: { rating: number }[]): { [key: number]: number } {
    return ratings.reduce((counts, obj) => {
      const rating = obj.rating;
      counts[rating] = (counts[rating] || 0) + 1;
      return counts;
    }, {} as { [key: number]: number });
  }

  getRatingPercentages(ratings: { rating: number }[]): {
    [key: number]: string;
  } {
    const total = ratings.length;
    const counts = this.getRatingCounts(ratings);
    const percentages: { [key: number]: string } = {};

    for (let i = 1; i <= 5; i++) {
      let percentage = total > 0 ? (counts[i] / total) * 100 : 0;
      percentages[i] = isNaN(percentage) ? '0%' : percentage.toFixed(1) + '%';
    }

    return percentages;
  }

  getAverageRating(ratings: { rating: number }[]): number {
    const total = ratings.reduce((sum, obj) => sum + obj.rating, 0);
    const average = ratings.length > 0 ? total / ratings.length : 0;
    return parseFloat(average.toFixed(1));
  }
}
