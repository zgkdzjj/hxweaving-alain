import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from 'app/services/department.service';
import { EmployeeService } from 'app/services/employee.service';
import { DepartmentListEditAddlistComponent } from './addlist/addlist.component';

@Component({
  selector: 'app-department-list-edit',
  templateUrl: './edit.component.html',
})
export class DepartmentListEditComponent implements OnInit {
  record: any = {};
  data: any = {};
  i: any;
  departments: any[] = [];
  departmentForm: FormGroup;
  employeeListOptions: any[] = [];
  employeeList: any[] = [];
  total = 0;
  isSpinning = false;
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private departSrv: DepartmentService,
    private employeeSrv: EmployeeService,
    private modalHelper: ModalHelper,
  ) {}

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      parent_id: [null],
      employee: this.fb.array([]),
    });
    this.departments = this.departments.map(obj => {
      return { value: obj.id, label: obj.name };
    });

    // load all employees
    // this.employeeSrv.getAll().subscribe(res => {
    //   this.employeeListOptions = res.map(obj => {
    //     return { value: obj.id, label: obj.name };
    //   });
    //   console.info(this.employeeListOptions);
    // });
    console.info(this.record);
    if (this.record.id > 0) {
      this.departSrv.showDepartment(this.record.id).subscribe(res => {
        this.data = res;
        this.employeeList = res.employee;
        this.total = this.employeeList.length;
        this.departmentForm.patchValue(this.data);
        console.info(this.data);
      });
    }
  }

  save(value: any) {
    const departmentFormValue = this.departmentForm.value;
    if (this.departmentForm.valid) {
      if (this.record.id > 0) {
        this.departSrv.updateDepartment(this.record.id, departmentFormValue).subscribe(res => {
          console.info(res);
          this.modal.close();
        });
      } else {
        this.departSrv.createDepartment(departmentFormValue).subscribe(res => {
          console.info(res);
          this.modal.close({ success: true });
        });
      }
    }
    // this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    //   this.modal.close(true);
    // });
  }

  close() {
    this.modal.destroy();
  }

  deleteEmployee(id) {
    console.info('deleteEmployee called');
    const deletingList = [];
    deletingList.push(id);
    console.info(id);
    this.departSrv.deleteEmployee(this.record.id, deletingList.toString()).subscribe(res => {
      console.info(res);
      // if added successfully, then refresh the data
      if (res == null) {
        if (this.record.id > 0) {
          this.departSrv.showDepartment(this.record.id).subscribe(department => {
            this.data = department;
            this.employeeList = department.employee;
            this.total = this.employeeList.length;
            this.departmentForm.patchValue(this.data);
          });
        }
      } else {
        this.msgSrv.create('error', `Failed to add employee.`);
      }
    });
  }
  addEmployee() {
    console.info('addEmployee called');
    this.modalHelper
      .createStatic(
        DepartmentListEditAddlistComponent,
        { registeredEmployee: this.employeeList, record: this.record },
        {
          size: 'sm',
          // modalOptions: { nzMask: false }
        },
      )
      .subscribe(res => {
        console.info(res);
        console.info(this.modal);
        // if added successfully, then refresh the data
        if (res.success) {
          if (this.record.id > 0) {
            this.departSrv.showDepartment(this.record.id).subscribe(department => {
              this.data = department;
              this.employeeList = department.employee;
              this.total = this.employeeList.length;
              this.departmentForm.patchValue(this.data);
            });
          }
        } else {
          this.msgSrv.create('error', `Failed to add employee.`);
        }
      });
  }
}
