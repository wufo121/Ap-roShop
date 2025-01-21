import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-article.component.html',
  styleUrls: ['./card-article.component.scss'],
})
export class CardArticleComponent {
  @Input() name: string = '';
  @Input() src: string = '';
  @Input() price: number = 0;
  @Input() rating: number = 0;
  @Input() id: number = 0;
  @Input() user: any = null;
  @Output() articleDeleted = new EventEmitter<number>();

  stars: number[] = [];

  constructor(private appService: AppService, private router: Router) {}

  isAdmin(): boolean {
    return this.appService.isAdmin(this.user);
  }

  deleteArticle(event: MouseEvent) {
    event.stopPropagation();
    this.appService.deleteArticleById(this.id).subscribe({
      next: (response) => {
        console.log('Article supprimé');
        this.articleDeleted.emit(this.id);
      },
      error: (err) => {
        console.error('Erreur lors de la supression');
      },
    });
  }

  redirectToPageArticle() {
    this.router.navigate([`/pageArticle/${this.id}`]);
  }
}
