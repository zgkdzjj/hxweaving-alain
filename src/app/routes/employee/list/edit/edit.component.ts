import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from 'app/services/employee.service';

@Component({
  selector: 'app-employee-list-edit',
  templateUrl: './edit.component.html',
})
export class EmployeeListEditComponent implements OnInit {
  record: any = {};
  i: any;
  employeeForm: FormGroup;
  fileList: UploadFile[] = [];

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private empSrv: EmployeeService,
  ) {}

  ngOnInit(): void {
    console.info(this.record);
    // this.i = this.record;
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
    this.employeeForm = this.fb.group({
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      age: [null, [Validators.required]],
      position: [null, [Validators.required]],
      entry_time: [null, [Validators.required]],
      role: [null, [Validators.required]],
      date_of_birth: [null],
      national_id_number: [null, [Validators.required]],
      marital_status: [null],
      status: [null, [Validators.required]],
      address: [null],
      notes: [null],
      // attachment: []
    });
    if (this.record.id > 0) {
      this.empSrv.showEmployee(this.record.id).subscribe(res => {
        this.employeeForm.patchValue(res);
        this.fileList = res.attachment;
      });
      // this.employeeForm.patchValue(this.record);
    }
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    console.info(this.fileList);
    return false;
  };

  deleteRow(data) {
    console.info(data);
    if (data['id'] > 0) {
      this.empSrv.deleteItsAttachment(this.record.id, data.id).subscribe(res => {
        console.info(res);
        this.fileList = this.fileList.filter(file => file.id !== data.id);
      });
    } else {
      this.fileList = this.fileList.filter(file => file.uid !== data.uid);
    }
  }

  submitForm() {
    console.info('submitForm called');
    const formData = new FormData();
    const fileAttributes = new Array();
    const employeeFormValue = this.employeeForm.value;
    // const activeFileList = this.fileList.filter(file => !(file.id > 0));
    const activeFileList = this.fileList;
    console.info(employeeFormValue);
    console.info(this.fileList);

    // validate employee form
    for (const i in this.employeeForm.controls) {
      if (employeeFormValue.hasOwnProperty(i)) {
        this.employeeForm.controls[i].markAsDirty();
        this.employeeForm.controls[i].updateValueAndValidity();
      }
    }

    if (this.employeeForm.valid) {
      console.info('form valid');
      console.info(this.employeeForm.valid);
      // append files
      activeFileList.forEach((file: any) => {
        console.info(file);
        formData.append('files[]', file);
        fileAttributes.push({ description: file.description, uid: file.uid });
      });

      console.info(fileAttributes);
      formData.append('fileAttributes', JSON.stringify(fileAttributes));

      for (const key in employeeFormValue) {
        if (employeeFormValue.hasOwnProperty(key)) {
          formData.append(key, employeeFormValue[key] != null ? employeeFormValue[key] : '');
        }
      }

      if (this.record.id > 0) {
        this.empSrv.updateEmployee(this.record.id, formData).subscribe(res => {
          console.info(res);
          this.modal.close({ success: true });
          this.msgSrv.create('success', `Employee ${res.name} has been updated successfully.`);
        });
      } else {
        console.info();
        this.empSrv.createEmployee(formData).subscribe(res => {
          console.info(res);
          this.modal.close({ success: true });
          this.msgSrv.create('success', `Employee ${res.name} has been updated successfully.`);
        });
      }
    } else {
      console.info('form invalid');
      return false;
    }
  }
  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
