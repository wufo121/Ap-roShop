import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('AppService', () => {
  let service: AppService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AppService],
    });
    service = TestBed.inject(AppService);
    httpMock = TestBed.inject(HttpTestingController);

    let store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => store[key] || null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => (store[key] = value)
    );
    spyOn(localStorage, 'removeItem').and.callFake(
      (key: string) => delete store[key]
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication Methods', () => {
    it('should login successfully', () => {
      const mockResponse = { token: 'test-token' };
      const email = 'test@test.com';
      const password = 'password';

      service.login(email, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });

    it('should register successfully', () => {
      const mockResponse = { success: true };
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        address: '123 Test St',
        password: 'password',
      };

      service
        .register(
          userData.username,
          userData.email,
          userData.address,
          userData.password
        )
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne('api/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });

    it('should get current user with token', () => {
      const mockToken = 'test-token';
      const mockUser = { id: 1, name: 'Test User' };
      localStorage.setItem('currentUser', mockToken);

      service.getCurrentUser().subscribe((response) => {
        expect(response).toEqual({ user: mockUser });
      });

      const req = httpMock.expectOne('api/me');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${mockToken}`
      );
      req.flush({ user: mockUser });
    });

    it('should return null user when no token exists', () => {
      localStorage.removeItem('currentUser');

      service.getCurrentUser().subscribe((response) => {
        expect(response).toEqual({ user: null });
      });
    });

    it('should check if user is logged in', () => {
      localStorage.setItem('currentUser', 'test-token');
      expect(service.isLoggedIn()).toBeTrue();

      localStorage.removeItem('currentUser');
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should check if user is admin', () => {
      const adminUser = { role: 'admin' };
      const regularUser = { role: 'user' };

      expect(service.isAdmin(adminUser)).toBeTrue();
      expect(service.isAdmin(regularUser)).toBeFalse();
      expect(service.isAdmin(null)).toBeFalse();
    });
  });

  describe('Article Methods', () => {
    it('should get all articles', () => {
      const mockArticles = [
        { id: 1, name: 'Article 1' },
        { id: 2, name: 'Article 2' },
      ];

      service.getArticles().subscribe((articles) => {
        expect(articles).toEqual(mockArticles);
      });

      const req = httpMock.expectOne('/api/articles');
      expect(req.request.method).toBe('GET');
      req.flush(mockArticles);
    });

    it('should get filtered articles', () => {
      const mockArticles = [
        { id: 1, name: 'Article 1', category: 'electronics' },
      ];
      const filters = { category: 'electronics', sort: 'price', maxPrice: 100 };

      service.getFilteredArticles(filters).subscribe((articles) => {
        expect(articles).toEqual(mockArticles);
      });

      const req = httpMock.expectOne(
        '/api/articles?category=electronics&sort=price&maxPrice=100'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockArticles);
    });

    it('should get article by id', () => {
      const mockArticle = { id: '1', name: 'Test Article' };
      const articleId = '1';

      service.getArticleById(articleId).subscribe((article) => {
        expect(article).toEqual(mockArticle);
      });

      const req = httpMock.expectOne(`api/articles/${articleId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockArticle);
    });

    it('should add article with form data', () => {
      const formData = new FormData();
      formData.append('name', 'Test Article');
      const mockResponse = { success: true };

      service.addArticle(formData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/articles');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(formData);
      req.flush(mockResponse);
    });

    it('should delete article by id', () => {
      const articleId = '1';
      const initialArticles = [
        { id: '1', name: 'Article 1' },
        { id: '2', name: 'Article 2' },
      ];
      service['articleSubject'].next(initialArticles);

      service.deleteArticleById(articleId);

      const req = httpMock.expectOne(`/api/articles/${articleId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(service['articleSubject'].value).toEqual([
        { id: '2', name: 'Article 2' },
      ]);
    });

    it('should handle error when deleting article', () => {
      const articleId = '1';
      const consoleSpy = spyOn(console, 'error');

      service.deleteArticleById(articleId);

      const req = httpMock.expectOne(`/api/articles/${articleId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Review Methods', () => {
    it('should get reviews by article id', () => {
      const articleId = '1';
      const mockReviews = [
        { id: 1, comment: 'Great!' },
        { id: 2, comment: 'Good' },
      ];

      service.getReviewsByArticleId(articleId).subscribe((reviews) => {
        expect(reviews).toEqual(mockReviews);
      });

      const req = httpMock.expectOne(`api/articles/${articleId}/reviews`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });

    it('should get rating by article id', () => {
      const articleId = '1';
      const mockRatings = [4, 5];

      service.getRatingByArticleId(articleId).subscribe((ratings) => {
        expect(ratings).toEqual(mockRatings);
      });

      const req = httpMock.expectOne(`api/articles/${articleId}/rating`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRatings);
    });

    it('should add review successfully', () => {
      const articleId = '1';
      const review = { rating: 5, comment: 'Excellent!' };
      const mockResponse = { success: true };
      localStorage.setItem('currentUser', 'test-token');

      service.addReview(articleId, review).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`api/articles/${articleId}/reviews`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(review);
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer test-token'
      );
      req.flush(mockResponse);
    });

    it('should handle error when adding review', () => {
      const articleId = '1';
      const review = { rating: 5, comment: 'Excellent!' };
      localStorage.setItem('currentUser', 'test-token');

      service.addReview(articleId, review).subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'Something went wrong with adding the review.'
          );
        },
      });

      const req = httpMock.expectOne(`api/articles/${articleId}/reviews`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('Cart Methods', () => {
    it('should add to cart', () => {
      const productId = '1';
      const quantity = 2;
      const mockResponse = { success: true };
      localStorage.setItem('currentUser', 'test-token');

      service.addToCart(productId, quantity).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('api/cart');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ productId, quantity });
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer test-token'
      );
      req.flush(mockResponse);
    });

    it('should get cart list', () => {
      const mockCart = [{ productId: '1', quantity: 2 }];
      localStorage.setItem('currentUser', 'test-token');

      service.getCartList().subscribe((cart) => {
        expect(cart).toEqual(mockCart);
      });

      const req = httpMock.expectOne('api/cart');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer test-token'
      );
      req.flush(mockCart);
    });

    it('should update cart list', () => {
      const mockCartData = { data: [{ productId: '1', quantity: 2 }] };
      localStorage.setItem('currentUser', 'test-token');

      service.updateCartList();

      const req = httpMock.expectOne('api/cart');
      req.flush(mockCartData);

      service.cartList$.subscribe((cartList) => {
        expect(cartList).toEqual(mockCartData.data);
      });
    });

    it('should delete and remove from cart', () => {
      const productId = '1';
      const initialCart = [
        { productId: '1', quantity: 2 },
        { productId: '2', quantity: 1 },
      ];
      service['cartListSubject'].next(initialCart);
      localStorage.setItem('currentUser', 'test-token');

      service.deleteAndRemoveFromCart(productId);

      const req = httpMock.expectOne(`api/cart/${productId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer test-token'
      );
      req.flush({});

      expect(service['cartListSubject'].value).toEqual([
        { productId: '2', quantity: 1 },
      ]);
    });
  });

  describe('Filter Methods', () => {
    it('should update filters', () => {
      const newFilters = { category: 'electronics', maxPrice: 100 };

      service.updateFilters(newFilters);

      const req = httpMock.expectOne(
        '/api/articles?category=electronics&maxPrice=100'
      );
      req.flush([]);

      service.filtersArticle$.subscribe((filters) => {
        expect(filters).toEqual(jasmine.objectContaining(newFilters));
      });
    });

    it('should apply filters and update articles', () => {
      const mockArticles = [{ id: 1, name: 'Filtered Article' }];
      const filters = { category: 'electronics', sort: '', maxPrice: 50 };
      service['filtersArticleSubject'].next(filters);

      service.applyFilters();

      const req = httpMock.expectOne(
        '/api/articles?category=electronics&maxPrice=50'
      );
      req.flush(mockArticles);

      service.article$.subscribe((articles) => {
        expect(articles).toEqual(mockArticles);
      });
    });

    it('should update articles with filters', () => {
      const mockArticles = [{ id: 1, name: 'Article' }];
      const filters = { category: 'electronics', sort: '', maxPrice: 50 };
      service['filtersArticleSubject'].next(filters);

      service.updateArticles();

      const req = httpMock.expectOne(
        '/api/articles?category=electronics&maxPrice=50'
      );
      req.flush(mockArticles);

      service.article$.subscribe((articles) => {
        expect(articles).toEqual(mockArticles);
      });
    });

    it('should update articles without filters', () => {
      const mockArticles = [{ id: 1, name: 'Article' }];
      const filters = { category: '', sort: '', maxPrice: 50 };
      service['filtersArticleSubject'].next(filters);

      service.updateArticles();

      const req = httpMock.expectOne('/api/articles');
      req.flush(mockArticles);

      service.article$.subscribe((articles) => {
        expect(articles).toEqual(mockArticles);
      });
    });
  });

  describe('Rating Methods', () => {
    const testRatings = [
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
      { rating: 2 },
    ];

    it('should get rating counts', () => {
      const counts = service.getRatingCounts(testRatings);
      expect(counts).toEqual({ 2: 1, 3: 1, 4: 1, 5: 2 });
    });

    it('should get rating percentages', () => {
      const percentages = service.getRatingPercentages(testRatings);
      expect(percentages).toEqual({
        1: '0%',
        2: '20.0%',
        3: '20.0%',
        4: '20.0%',
        5: '40.0%',
      });
    });

    it('should get average rating', () => {
      const average = service.getAverageRating(testRatings);
      expect(average).toBe(3.8);
    });

    it('should handle empty ratings', () => {
      const emptyRatings: { rating: number }[] = [];

      expect(service.getRatingCounts(emptyRatings)).toEqual({});
      expect(service.getRatingPercentages(emptyRatings)).toEqual({
        1: '0.0%',
        2: '0.0%',
        3: '0.0%',
        4: '0.0%',
        5: '0.0%',
      });
      expect(service.getAverageRating(emptyRatings)).toBe(0);
    });
  });

  describe('Category Methods', () => {
    it('should get all categories', () => {
      const mockCategories = ['electronics', 'clothing', 'books'];

      service.getAllCategories().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne('/api/categories');
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });
});
