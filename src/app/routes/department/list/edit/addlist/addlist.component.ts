import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { EmployeeService } from 'app/services/employee.service';
import { NzModalRef } from 'ng-zorro-antd';
import { DepartmentService } from 'app/services/department.service';
@Component({
  selector: 'app-department-employee-list',
  templateUrl: './addlist.component.html',
})
export class DepartmentListEditAddlistComponent implements OnInit {
  record: any = {};
  allEmployees: any[] = [];
  registeredEmployee: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  total = 0;

  constructor(
    private _httpClient: _HttpClient,
    private empSrv: EmployeeService,
    private modal: NzModalRef,
    private departSrv: DepartmentService,
  ) {}
  ngOnInit() {
    // get all employee
    this.empSrv.getAll().subscribe(res => {
      this.allEmployees = res;
      // mark registered employee
      this.total = this.registeredEmployee.length;
      this.registeredEmployee.forEach((data, index) => {
        this.mapOfCheckedId[data.id] = true;
      });
    });
    console.info(this.registeredEmployee);
  }
  refreshStatus(item) {
    console.info(item);
    console.info(this.mapOfCheckedId);
  }
  close() {
    this.modal.close();
  }
  save() {
    console.info('save called');
    const employeeList: any[] = [];
    console.info(this.mapOfCheckedId);
    Object.entries(this.mapOfCheckedId).forEach(([key, value]) => {
      console.log(`${key} :  ${value}`);
      if (value) {
        employeeList.push(key);
      }
    });
    console.info(employeeList);
    this.departSrv.addEmployee(this.record.id, { employeeList: JSON.stringify(employeeList) }).subscribe(res => {
      console.info(res);
      this.modal.close({ success: true });
    });
  }
}
