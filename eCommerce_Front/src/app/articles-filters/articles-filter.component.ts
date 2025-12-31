import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-articles-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: 'articles-filter.component.html',
  styleUrls: ['articles-filter.component.scss'],
})
export class ArticlesFilterComponent implements OnInit {
  @Input() categories: any[] = [];

  selectedCategory: string = '';
  selectedSort: string = '';
  selectedPrice: number = 50;
  priceLabel = '50';

  isBrowser: boolean;

  public appService = inject(AppService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.appService.filtersArticle$.subscribe((filters) => {
      this.selectedCategory = filters.category;
      this.selectedSort = filters.sort;
      this.selectedPrice = filters.maxPrice;

      this.priceLabel = `${this.selectedPrice}€`;
    });
  }

  onSortChange(): void {
    this.appService.updateFilters({ sort: this.selectedSort });
  }

  onCategoryChange(): void {
    this.appService.updateFilters({ category: this.selectedCategory });
  }

  onPriceChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const price = parseInt(input.value, 10);
    this.selectedPrice = price;
    this.priceLabel = `${this.selectedPrice}€`;
    this.appService.updateFilters({ maxPrice: price });
  }
}
