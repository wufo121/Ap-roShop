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
<<<<<<< HEAD
<<<<<<< HEAD

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('currentUser');
    console.log('Token retrieved:', token);
=======

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('currentUser');
>>>>>>> d5d3dce (Update: Add token with jwt and get data of curentUser)

    if (!token) {
      return new Observable<any>();
    }

<<<<<<< HEAD
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('api/me', { headers });
=======
  isLoggedIn(): boolean {
    return localStorage.getItem('curentUser') !== null;
>>>>>>> ecf55a6 (Update: we can see username when user is login)
=======
    const parsedToken = JSON.parse(token);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${parsedToken}`
    );
    return this.http.get<any>('api/me', { headers });
>>>>>>> d5d3dce (Update: Add token with jwt and get data of curentUser)
  }
}
