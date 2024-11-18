import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-card-article',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './card-article.component.html',
  styleUrls: ['./card-article.component.scss']
})
export class CardArticleComponent {
  @Input() name: string = '';
  @Input() src: string = '';
  @Input() price: number = 0;
  @Input() rating: number = 0;

  stars: number[] = []

  ngOnInit(): void {
    this.stars = new Array(5)
  }
  
}
