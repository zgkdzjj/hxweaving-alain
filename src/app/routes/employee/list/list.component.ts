import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { EmployeeService } from 'app/services/employee.service';

// Components
import { EmployeeListViewComponent } from './view/view.component';
import { EmployeeListEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './list.component.html',
})
export class EmployeeListComponent implements OnInit {
  // url = `/user`;
  data: any[] = [];
  loading = false;
  total: Number = 0;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号',
      },
    },
  };
  @ViewChild('st') st: STComponent;
  page: STPage = {
    front: false,
    // total: '123',
    show: true,
    showSize: true,
  };
  columns: STColumn[] = [
    { title: '姓名', index: 'name', i18n: 'STColumn.name' },
    { title: '年龄', index: 'age', i18n: 'STColumn.age' },
    { title: '性别', index: 'gender', i18n: 'STColumn.gender' },
    { title: '职位', index: 'position', i18n: 'STColumn.position' },
    {
      title: '操作', i18n: 'STColumn.actions',
      buttons: [
        { text: '查看', i18n: 'STColumnButton.view', click: (item: any) => { this.openView(item); } },
        { text: '编辑', i18n: 'STColumnButton.edit', click: (item: any) => { this.openEdit(item); } },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private employeeSrv: EmployeeService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    // console.info('getData called');
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    this.employeeSrv.getEmployees(l, o).subscribe(
      res => {
        console.info(res);
        this.data = res.rows;
        this.total = res.count;
        this.loading = false;
      },
      err => console.error('error', err),
    );
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
    console.info('add called');
    this.modal.createStatic(EmployeeListEditComponent, { i : { id: 0 } }).subscribe(
      (res) => {
        console.info(res);
        this.st.reload();
      }
    );
  }

  // open view modal
  openView(record: any = {}) {
    console.info('openView called');
    console.info(record);
    this.modal.create(EmployeeListViewComponent, {record}, { size: 'lg'}).subscribe(
      res => {
        console.info(res);
      }
    );
  }

  // open edit modal
  openEdit(record: any = {}) {
    console.info('openEdit called');
    console.info(record);
    this.modal.createStatic(EmployeeListEditComponent, { record }, {size: 'lg'}).subscribe(
      res => {
        console.info(res);
        this.st.reload();
      }
    );
  }
  // Listening Simple Table Event
  stChange(e: STChange) {
    console.info('stChange called');
    console.info(e);
    const limit = e.ps.toString();
    const offset = ((e.pi - 1) * e.ps).toString();
    switch (e.type) {
      case 'pi':
        this.getData(limit, offset);
        break;
      case 'ps':
        this.getData(limit, offset);
        break;
    }


  }

}
