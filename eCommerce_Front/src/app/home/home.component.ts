import { Component, OnInit, inject } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { CardArticleComponent } from '../card-article/card-article.component';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CardCartComponent } from '../card-cart/card-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CardArticleComponent,
    HeaderComponent,
    NgxPaginationModule,
    FormsModule,
    CardCartComponent,
  ],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  public appService = inject(AppService);
  articles: any[] = [];
  user: any = null;
  itemsPerPage = 12;
  currentPage = 1;
  searchTerms: string = '';
  filtredArticles: any[] = this.articles;
  cartList: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.appService.getCurrentUser().subscribe({
        next: (data) => {
          this.user = data.user;
        },
      });

      this.appService.cartList$.subscribe({
        next: (cartList) => {
          this.cartList = cartList;
          console.log('Panier mis à jour :', this.cartList);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du panier :', err);
        },
      });

      this.appService.updateCartList();
    }

    this.appService.getArticles().subscribe((articles) => {
      this.articles = articles;
      this.filtredArticles = [...this.articles];

      this.articles.forEach((article) => {
        this.appService.getRatingByArticleId(article.id).subscribe({
          next: (response: any) => {
            if (response && response.data && Array.isArray(response.data)) {
              const averageRating = this.appService.getAverageRating(
                response.data
              );
              article.rating = Math.round(averageRating);
            } else {
              console.error(
                `Réponse inattendue pour l'article ${article.id}:`,
                response
              );
              article.rating = 0;
            }
          },
          error: (err) => {
            console.error(
              `Erreur lors de la récupération de la notation pour l'article ${article.id}`,
              err
            );
            article.rating = 0;
          },
        });
      });
    });
  }

  toggleDropDown(event$: Event) {
    const dropdown = (event$.currentTarget as HTMLElement).querySelector(
      '.DropDownContent'
    );
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  }

  handleArticleDeletion(articleId: number) {
    this.articles = this.articles.filter((article) => article.id !== articleId);
  }

  onSearch() {
    if (this.searchTerms.trim() === '') {
      this.filtredArticles = this.articles;
    } else {
      this.filtredArticles = this.articles.filter((article) =>
        article.name.toLowerCase().includes(this.searchTerms.toLowerCase())
      );
    }
  }

  redirectToAddArticle() {
    this.router.navigate(['/add']);
  }
}
