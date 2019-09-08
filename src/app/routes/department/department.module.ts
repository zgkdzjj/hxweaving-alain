import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentListComponent } from './list/list.component';
import { DepartmentListEditComponent } from './list/edit/edit.component';
import { DepartmentListEditAddlistComponent } from './list/edit/addlist/addlist.component';

const COMPONENTS = [DepartmentListComponent];
const COMPONENTS_NOROUNT = [DepartmentListEditComponent, DepartmentListEditAddlistComponent];

@NgModule({
  imports: [SharedModule, DepartmentRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class DepartmentModule {}
