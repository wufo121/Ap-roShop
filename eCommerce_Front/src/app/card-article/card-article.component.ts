import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';
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

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.stars = new Array(5);
  }
  isLoggedIn(): boolean {
    return this.appService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.appService.isAdmin(this.user);
  }

  deleteArticle() {
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
}
