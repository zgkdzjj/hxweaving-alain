import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './list/list.component';
import { EmployeeListViewComponent } from './list/view/view.component';
import { EmployeeListEditComponent } from './list/edit/edit.component';

const COMPONENTS = [
  EmployeeListComponent];
const COMPONENTS_NOROUNT = [
  EmployeeListViewComponent,
  EmployeeListEditComponent];

@NgModule({
  imports: [
    SharedModule,
    EmployeeRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class EmployeeModule { }
