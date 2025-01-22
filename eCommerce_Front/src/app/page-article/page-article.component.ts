import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CardReviewComponent } from '../card-review/card-review.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-page-article',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NgxPaginationModule,
    CardReviewComponent,
    ReviewFormComponent,
  ],
  templateUrl: './page-article.component.html',
  styleUrl: './page-article.component.scss',
})
export class PageArticleComponent implements OnInit {
  articleId: string | null = null;
  article: any = null;
  reviews: any[] = [];
  ratings: any;
  showFormReview = false;
  percentage: any | undefined = undefined;
  averageRating: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private route: ActivatedRoute, private appService: AppService) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');

    if (this.articleId) {
      this.fetchArticle();
      this.fetchReviews();
      this.fetchRating();
    }
  }

  fetchRating(): void {
    this.appService.getRatingByArticleId(this.articleId!).subscribe({
      next: (response: any) => {
        this.ratings = response.data;
        console.log('Rating reçues', this.ratings);
        this.getRatingPourcentage();
        this.getAverageRating();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notes:', err);
        this.ratings = [];
      },
    });
  }

  fetchArticle(): void {
    this.appService.getArticleById(this.articleId!).subscribe({
      next: (data) => {
        this.article = data;
        console.log('Article reçu:', this.article);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'article:", err);
      },
    });
  }

  fetchReviews(): void {
    this.appService.getReviewsByArticleId(this.articleId!).subscribe({
      next: (response: any) => {
        this.reviews = Array.isArray(response.data) ? response.data : [];
        console.log('Reviews reçues', this.reviews);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des avis:', err);
        this.reviews = [];
      },
    });
  }

  addReview(newReviews: any): void {
    this.reviews = [...this.reviews, newReviews];
    this.showFormReview = false;
    this.fetchReviews();
  }

  getRatingPourcentage() {
    this.percentage = this.appService.getRatingPercentages(this.ratings);
  }

  getAverageRating() {
    this.averageRating = this.appService.getAverageRating(this.ratings);
  }
}
