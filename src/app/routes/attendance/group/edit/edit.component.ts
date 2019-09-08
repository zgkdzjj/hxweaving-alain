import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from 'app/services/department.service';
import { EmployeeService } from 'app/services/employee.service';
import { ScheduleService } from 'app/services/schedule.service';
import { GroupService } from 'app/services/group.service';

@Component({
  selector: 'app-attendance-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class AttendanceGroupEditComponent implements OnInit {
  record: any = {};
  i: any;
  radioValue = 'A';
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  listOfDepartments: any[] = [];
  listOfEmployees: any[] = [];
  listOfSchedule: any[] = [];
  agForm: FormGroup; // Attendance Group Form

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private departSrv: DepartmentService,
    private employeeSrv: EmployeeService,
    private scheduleSrv: ScheduleService,
    private groupSrv: GroupService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    console.info('ngOnInit called');
    this.record['id'] = this.route.snapshot.paramMap.get('id');
    console.info(this.record);
    //if (this.record.id > 0) this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
    this.agForm = this.fb.group({
      name: [null, [Validators.required]],
      //departments: this.fb.array([]),
      departments: [null],
      type: [null],
      managers: [null],
      memberCount: [null],
      schedule: [null],
    });
    // get the list of departments
    this.departSrv.getAll().subscribe(res => {
      this.listOfDepartments = res;
    });

    // get the list of schedule
    this.scheduleSrv.getAll().subscribe(res => {
      this.listOfSchedule = res.map(e => {
        return {
          section_des: `${e.serial}: ${this.scheduleSrv.objToDescription(e['sections'])}`,
          ...e,
        };
      });
      console.info(this.listOfSchedule);
    });

    // if edit
    if (this.record['id'] != null) {
      this.groupSrv.showGroup(this.record['id']).subscribe(res => {
        console.info(res);
        this.agForm.patchValue(res);
      });
    } else {
    }
  }

  save(value: any) {
    // this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    // });
    const agFormValue = this.agForm.value;
    console.info(agFormValue);
    // add member count
    agFormValue['memberCount'] = this.listOfEmployees.length;
    if (this.record.id > 0) {
      this.groupSrv.updateGroup(this.record.id, agFormValue).subscribe(res => {
        console.info(res);
        this.router.navigate(['/attendance/group']);
      });
    } else {
      this.groupSrv.createGroup(agFormValue).subscribe(res => {
        console.info(res);
      });
    }
    //this.router.navigate(['/attendance/group']);
  }

  onSelectDepartment(value) {
    console.info(value);
    this.employeeSrv.getAll().subscribe(res => {
      console.info(res);
      this.listOfEmployees = res.filter(res => value.includes(res.department_id));
    });
  }

  close() {}
  goBack() {
    console.info('goBack called');
    this.router.navigate(['/attendance/group']);
  }
}
