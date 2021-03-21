import { RootComponent } from './root.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootRoutes } from '../routes';

const routes: Routes = [
  { path: '', component: RootComponent, children: RootRoutes },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {}
