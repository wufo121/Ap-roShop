import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routes';
import {  provideHttpClient } from '@angular/common/http';
import { ListArticleComponent } from './list-article/list-article.component';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  

  declarations:[
    
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    CommonModule,
    ListArticleComponent,
    HomeComponent,
   
 
  ],
  exports: [],
  providers: [
    provideHttpClient(),
    provideClientHydration()

  ],
  bootstrap: [ AppComponent ]

})
export class AppModule { }
