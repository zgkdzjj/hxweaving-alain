import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { DepartmentListEditComponent } from './edit/edit.component';
import { DepartmentService } from 'app/services/department.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './list.component.html',
})
export class DepartmentListComponent implements OnInit {
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
    { title: 'Id', index: 'id' },
    { title: 'Name', index: 'name', i18n: 'STColumn.department.name' },
    { title: 'Description', index: 'description', i18n: 'STColumn.department.description' },
    { title: 'Parent Id', index: 'parent_id' },
    { title: 'Superior', index: 'superior', i18n: 'STColumn.department.superior' },
    {
      title: '',
      buttons: [
        { text: '查看', click: (record: any) => this.openView(record) },
        { text: '编辑', click: (record: any) => this.openEdit(record) },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private departSrc: DepartmentService) {}

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    // console.info('getData called');
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    this.departSrc.getDepartments(l, o).subscribe(
      res => {
        console.info(res);
        this.data = res.rows;
        this.data = this.data.map(e => {
          console.info(e);
          const superior = this.data.filter(obj => obj.id === e.parent_id);
          console.info(superior);
          return {
            id: e.id,
            name: e.name,
            description: e.description,
            parent_id: e.parent_id,
            superior: superior.length === 1 ? superior[0]['name'] : '',
          };
        });
        console.info(this.data);
        this.total = res.count;
        this.loading = false;
      },
      err => console.error('error', err),
    );
  }

  add() {
    this.modal
      .createStatic(DepartmentListEditComponent, { i: { id: 0 }, departments: this.data }, { size: 'md' })
      .subscribe(res => {
        console.info(res);
        this.st.reload();
      });
  }

  openView(record) {}

  openEdit(record) {
    this.modal
      .createStatic(DepartmentListEditComponent, { record, departments: this.data }, { size: 'md' })
      .subscribe(res => {
        console.info(res);
        this.st.reload();
      });
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
