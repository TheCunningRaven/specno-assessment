import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { HomeComponent } from './components/home/home.component';
import { OfficeViewComponent } from './components/office-view/office-view.component';
import { OfficeComponent } from './components/office/office.component';
;

const routes: Routes = [

  { path: '', component: HomeComponent, data: { animation: 'isRight' } },
  { path: 'home', component: HomeComponent, data: { animation: 'isLeft' } },
  { path: 'office-view', component: OfficeViewComponent, data: { animation: 'isRight' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [HomeComponent, OfficeComponent, OfficeViewComponent, EmployeesComponent];
