import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SushiBarComponent } from './sushi-bar/sushi-bar.component';

const routes: Routes = [
  {path: '', redirectTo: 'sushibar', pathMatch: 'full'},
  {path: 'sushibar', component: SushiBarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
