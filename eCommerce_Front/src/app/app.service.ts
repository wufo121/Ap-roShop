import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Articles } from './article';

@Injectable({
  providedIn: 'root',
})
export class AppService {


  private http = inject(HttpClient);
  private Articles = signal<Articles[]>([])
  readonly url = 'http://localhost:3000/';

  getArticles(): Observable<Articles[]> {
    return this.http.get<Articles[]>(this.url).pipe(
      tap(Articles => this.Articles.set(Articles))
    );
  }
}