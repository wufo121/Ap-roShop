import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageArticleComponent } from './page-article.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('PageArticleComponent', () => {
  let component: PageArticleComponent;
  let fixture: ComponentFixture<PageArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageArticleComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) },
            params: { subscribe: () => {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
