import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddArticleComponent } from './add-article/add-article.component';
import { PageArticleComponent } from './page-article/page-article.component';
import { ProfilPageComponent } from './profil-page/profil-page.component';
import { AuthGuard } from './Auth/auth-guard';
import { NoAuthGuard } from './Auth/no-auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  { path: 'add', component: AddArticleComponent },
  { path: 'pageArticle/:id', component: PageArticleComponent },
  {
    path: 'pageProfil/:id',
    component: ProfilPageComponent,
    canActivate: [AuthGuard],
  },
];
