import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, of, catchError, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private cartListSubject = new BehaviorSubject<any[]>([]);
  cartList$ = this.cartListSubject.asObservable();
  private articleSubject = new BehaviorSubject<any[]>([]);
  article$ = this.articleSubject.asObservable();
  private filtersArticleSubject = new BehaviorSubject<any>({
    category: '',
    sort: '',
    maxPrice: 50,
  });
  filtersArticle$ = this.filtersArticleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post('api/login', { email, password });
  }

  register(
    username: string,
    email: string,
    address: string,
    password: string
  ): Observable<any> {
    return this.http.post('api/register', {
      username,
      email,
      address,
      password,
    });
  }

  getArticles(): Observable<any> {
    return this.http.get<any[]>('/api/articles');
  }

  getFilteredArticles(filters: any): Observable<any> {
    let params = new HttpParams();

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }

    return this.http.get<any[]>('/api/articles', { params });
  }
  updateFilters(filters: any): void {
    this.filtersArticleSubject.next({
      ...this.filtersArticleSubject.value,
      ...filters,
    });
    this.applyFilters();
  }
  applyFilters(): void {
    const currentFilters = this.filtersArticleSubject.value;
    console.log('Applying filters:', currentFilters); // <-- DEBUG
    this.getFilteredArticles(currentFilters).subscribe({
      next: (response) => {
        console.log('Filtered articles:', response); // <-- DEBUG
        this.articleSubject.next(response);
      },
      error: (err) => {
        console.error(
          'Erreur lors de la mise à jour des articles filtrés :',
          err
        );
      },
    });
  }

  updateArticles(): void {
    const filters = this.filtersArticleSubject.value;
    if (filters.category || filters.sort || filters.maxPrice !== 50) {
      this.applyFilters();
    } else {
      this.getArticles().subscribe({
        next: (response) => {
          this.articleSubject.next(response);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des articles :', err);
        },
      });
    }
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
          console.error('Erreur survenue :', error);
          return throwError(
            () => new Error("Une erreur est survenue lors de l'ajout d'un avis")
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
          console.error('Erreur :', error);
          return throwError(
            () =>
              new Error(
                "Une erreur est survenu lors de l'ajout d'un article au panier"
              )
          );
        })
      );
  }

  deleteArticleById(id: string): void {
    this.http
      .delete(`/api/articles/${id}`)
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
          const updatedArticle = this.articleSubject.value.filter(
            (article) => article.id !== id
          );
          this.articleSubject.next(updatedArticle);

          console.log('Produit supprimé avec succès du panier');
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de l'article :", err);
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

  getAllCategories(): Observable<any> {
    return this.http.get<any[]>('/api/categories');
  }
}
