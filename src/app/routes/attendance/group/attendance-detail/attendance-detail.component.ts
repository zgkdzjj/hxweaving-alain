import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GroupService } from 'app/services/group.service';
import { EmployeeService } from 'app/services/employee.service';
import { ScheduleService } from 'app/services/schedule.service';
import { forkJoin } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttendanceDtlService } from 'app/services/attendanceDtl.service';

// Date helper
import { format, getDaysInMonth } from 'date-fns';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.less'],
})
export class AttendanceDetailComponent implements OnInit {
  attendanceDtl = {};
  scheduleDtl = {};
  title = '';
  listOfSchedule: any[] = [];
  days: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  cellDtls: any[] = [];
  dateOption = { dateStyle: 'short'};
  members: any[] = ['a', 'b', 'c'];
  attendanceForm: FormGroup;
  month = '';
  overlayStyle = {
    width: '300px',
  };
  attendDetail = 'hello';
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private groupSrv: GroupService,
    private scheduleSrv: ScheduleService,
    private fb: FormBuilder,
    private attendSrv: AttendanceDtlService,
    private employeeSrv: EmployeeService,
  ) {}
  ngOnInit() {
    this.attendanceDtl['id'] = this.route.snapshot.paramMap.get('id');
    this.title = `考勤详情 - ${this.attendanceDtl['id']}`;
    this.attendanceForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      employee_id: [null, [Validators.required]],
      date: [null, [Validators.required]],
      schedule_id: [null, [Validators.required]],
      money: [null, [Validators.required]],
      notes: [null],
    });
    forkJoin(this.groupSrv.showGroup(this.attendanceDtl['id']), this.scheduleSrv.getAll(), this.employeeSrv.getAll()).subscribe(res => {
      console.info(res[0]);
      console.info(res[1]);
      console.info(res[2]);
      this.members = res[2].filter(employee => res[0]['departments'].includes(employee['department_id']));
      console.info(this.members);
      this.listOfSchedule = res[1].filter(e =>
        Array.isArray(res[0]['schedule']) ? res[0]['schedule'].includes(e['id']) : false,
      );
      console.info(this.listOfSchedule);
    });
    // this.groupSrv.showGroup(this.attendanceDtl['id']).subscribe(res => {
    //   console.info(res);
    //   //this.scheduleSrv.showSchedule(res.)
    // });
  }
  onMonthChange(value: Date) {
    console.info(value);
    console.info(getDaysInMonth(value));
    console.info(format(value, 'YYYY-MM'));
    console.info(this.month);
    const daysCount = getDaysInMonth(value);
    this.days = [];
    if (value != null) {
      // console.info(value.getDate());
      // console.info(`${new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate()}`);
      // const daysCount = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
      console.info(daysCount);
      // init days in this month
      for (let i = 0; i < daysCount; i++) {
        const d = new Date(value.getFullYear(), value.getMonth(), i + 1);
        this.days.push({
          date: format(d, 'YYYY-MM-DD'),
          days: d.getDay(),
        });
      }
      console.info(this.days);
    }

    // get attendance details
    console.info(this.members.map(m => m['id']));
    this.attendSrv.getByMonthAndMembers(format(value, 'YYYY-MM'),this.members.map(m => m['id'])).subscribe(res => {
      console.info(res);
      this.cellDtls = res;
    });
  }
  goBack() {
    // this.router.navigate(['/attendance/group']);
    this.location.back();
  }
  onCellClick(m, d) {
    console.info(m);
    console.info(d);
    this.title = `${m['name']}(${m['id']}) 考勤信息`;
    this.attendanceForm.reset();
    // disable name / date fields
    this.attendanceForm.get('name').disable();
    this.attendanceForm.get('date').disable();
    this.attendanceForm.get('name').setValue(m['name']);
    this.attendanceForm.get('employee_id').setValue(m['id']);
    this.attendanceForm.get('date').setValue(d['date']);

    const cellDtl = this.cellDtls.filter(e => e['employee_id'] == m['id'] && e['date'] == d['date']);
    console.info(cellDtl);
    if(cellDtl.length == 0){

    } else {
      this.attendanceForm.get('id').setValue(cellDtl[0]['id']);
      this.attendanceForm.get('schedule_id').setValue(cellDtl[0]['schedule_id']);
      this.attendanceForm.get('money').setValue(cellDtl[0]['money']);
      this.attendanceForm.get('notes').setValue(cellDtl[0]['notes']);
    }
    // c['employee_id'] == m['id'] && c['date'] == d['date']

  }
  submitForm() {
    console.info('submitForm called');
    const attendanceFormValue = this.attendanceForm.getRawValue();
    console.info(attendanceFormValue);
    //attendanceFormValue['date'] = attendanceFormValue['date'].toLocaleDateString('cn');
    if (attendanceFormValue['id'] > 0) {
      this.attendSrv.updateAttendanceDtl(attendanceFormValue['id'], attendanceFormValue).subscribe(res => {
        console.info(res);
      })
    } else {
      this.attendSrv.createAttendanceDtl(attendanceFormValue).subscribe(res => {
        console.info(res);
      });
    }
  }
  onVisibleChange(value) {
    console.info(value);
  }
  mapToDes(id) {
    // console.info(id);
    const des = this.listOfSchedule.filter(e => e['id'] == id)[0]['serial'];
    return des;
  }
}
