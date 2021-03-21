import { RootModule } from './pages/root/root.module';
import { RootComponent } from './pages/root/root.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RootRoutes } from './pages/routes';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/root/root.module').then((m) => m.RootModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '', redirectTo: 'main ', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'main',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
