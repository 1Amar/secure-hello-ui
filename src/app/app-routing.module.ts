import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [  // <-- add export here
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('./components/login/login.component').then(m => m.LoginComponent)
  // },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
  path: 'logout',
  loadComponent: () =>
    import('./components/logout/logout.component').then(m => m.LogoutComponent)
}
,
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
