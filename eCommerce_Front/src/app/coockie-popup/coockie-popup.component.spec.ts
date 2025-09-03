import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoockiePopupComponent } from './coockie-popup.component';

describe('CoockiePopupComponent', () => {
  let component: CoockiePopupComponent;
  let fixture: ComponentFixture<CoockiePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoockiePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoockiePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
