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
  constructor(private router: Router) {}

  ngOnInit() {
    this.appService.getArticles().subscribe((data) => {
      console.log('Articles received:', data);
      this.articles = data;
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
  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
}
