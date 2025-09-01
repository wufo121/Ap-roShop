import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesFilterComponent } from './articles-filter.component';

describe('CategoriesFilterComponent', () => {
  let component: ArticlesFilterComponent;
  let fixture: ComponentFixture<ArticlesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
