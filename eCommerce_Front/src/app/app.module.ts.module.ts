import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
  ],
  exports: [],
  providers: [provideHttpClient(), provideClientHydration()],
})
export class AppModule {}
