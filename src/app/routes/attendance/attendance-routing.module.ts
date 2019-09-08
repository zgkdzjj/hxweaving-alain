import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceScheduleComponent } from './schedule/schedule.component';
import { AttendanceGroupComponent } from './group/group.component';
import { AttendanceGroupEditComponent } from './group/edit/edit.component';
import { AttendanceDetailComponent } from './group/attendance-detail/attendance-detail.component';

const routes: Routes = [
  { path: 'schedule', component: AttendanceScheduleComponent },
  { path: 'group', component: AttendanceGroupComponent },
  { path: 'group/new', component: AttendanceGroupEditComponent, data: { title: '新建考勤组' } },
  { path: 'group/:id', component: AttendanceGroupEditComponent, data: { title: '编辑考勤组' } },
  { path: 'group/:id/attendance-detail', component: AttendanceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
