import { Component, OnInit, inject } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { CardArticleComponent } from '../card-article/card-article.component';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CardArticleComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  private appService = inject(AppService);
  articles: any[] = [];
  user: any = null;
  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.appService.getCurrentUser().subscribe({
        next: (data) => {
          this.user = data.user;
          console.log(this.user);
        },
      });
      this.appService.getArticles().subscribe((data) => {
        console.log('Articles received:', data);
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

  isLoggedIn(): boolean {
    return this.appService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.appService.isAdmin(this.user);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      location.reload();
    }
  }

  handleArticleDeletion(articleId: number) {
    this.articles = this.articles.filter((article) => article.id !== articleId);
  }

  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
  redirectToAddArticle() {
    this.router.navigate(['/add']);
  }
}
