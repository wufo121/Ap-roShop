import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-page-article',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeaderComponent],
  templateUrl: './page-article.component.html',
  styleUrl: './page-article.component.scss',
})
export class PageArticleComponent implements OnInit {
  articleId: string | null = null;
  article: any = null;

  constructor(private route: ActivatedRoute, private appService: AppService) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');

    if (this.articleId) {
      this.appService.getArticleById(this.articleId).subscribe({
        next: (data) => {
          this.article = data;
          console.log('Article reçu:', this.article);
        },
        error: (err) => {
          console.error("Erreur lors de la récupération de l'article:", err);
        },
      });
    }
  }
}
