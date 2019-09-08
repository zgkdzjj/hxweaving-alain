import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ScheduleService } from 'app/services/schedule.service';
import { AttendanceScheduleEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-attendance-schedule',
  templateUrl: './schedule.component.html',
})
export class AttendanceScheduleComponent implements OnInit {
  // url = `/user`;
  data: any[] = [];
  loading = false;
  total = 0;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号',
      },
    },
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id' },
    { title: '班次名称', index: 'serial' },
    { title: '考勤时间', index: 'sections_des' },
    {
      title: '操作',
      buttons: [
        { text: '查看', click: (item: any) => this.openView(item) },
        { text: '编辑', type: 'static', click: (item: any) => this.openEdit(item) },
      ],
    },
  ];
  page: STPage = {
    front: false,
    // total: '123',
    show: true,
    showSize: true,
  };

  constructor(private http: _HttpClient, private modal: ModalHelper, private scheduleSrv: ScheduleService) {}

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    // console.info('getData called');
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    this.scheduleSrv.getSchedule(l, o).subscribe(
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
    this.modal.create(AttendanceScheduleEditComponent, { i: { id: 0 } }).subscribe(() => this.st.reload());
  }
  openView(item) {}
  openEdit(record) {
    this.modal.create(AttendanceScheduleEditComponent, { record }).subscribe(res => {
      // console.info(res);
      // console.info('model closed');
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
