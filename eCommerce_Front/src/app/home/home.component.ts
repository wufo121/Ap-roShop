import { Component, OnInit, inject } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { CardArticleComponent } from '../card-article/card-article.component';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CardArticleComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  public appService = inject(AppService);
  articles: any[] = [];
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.appService.getCurrentUser().subscribe({
        next: (data) => {
          this.user = data.user;
        },
      });
      this.appService.getArticles().subscribe((data) => {
        this.articles = data;
      });
    }
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

  redirectToAddArticle() {
    this.router.navigate(['/add']);
  }
}
