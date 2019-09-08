import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceScheduleComponent } from './schedule/schedule.component';
import { AttendanceScheduleEditComponent } from './schedule/edit/edit.component';
import { AttendanceGroupComponent } from './group/group.component';
import { AttendanceGroupEditComponent } from './group/edit/edit.component';
import { AttendanceDetailComponent } from './group/attendance-detail/attendance-detail.component';

const COMPONENTS = [AttendanceScheduleComponent, AttendanceGroupComponent];
const COMPONENTS_NOROUNT = [AttendanceScheduleEditComponent, AttendanceGroupEditComponent, AttendanceDetailComponent];

@NgModule({
  imports: [SharedModule, AttendanceRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class AttendanceModule {}
