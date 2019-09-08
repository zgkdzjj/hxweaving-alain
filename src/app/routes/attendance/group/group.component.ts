import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { GroupService } from 'app/services/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance-group',
  templateUrl: './group.component.html',
})
export class AttendanceGroupComponent implements OnInit {
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
  page: STPage = {
    front: false,
    // total: '123',
    show: true,
    showSize: true,
  };
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '人数', index: 'memberCount' },
    { title: '类型', index: 'type' },
    { title: '考勤时间', index: '' },
    {
      title: '操作',
      buttons: [
        { text: '考勤打卡', click: (item: any) => this.openAttendanceDetail(item) },
        { text: '修改规则', click: (item: any) => this.openEdit(item) },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private groupSrv: GroupService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    // console.info('getData called');
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    this.groupSrv.getGroups(l, o).subscribe(
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
    console.info('add called');
    this.router.navigate(['/attendance/group', 'new']).then();
  }
  openEdit(record) {
    console.info('openEdit called');
    console.info(record);
    this.router.navigate(['/attendance/group', record.id]);
  }
  openAttendanceDetail(record) {
    console.info('openAttendance called');
    this.router.navigate(['/attendance/group', record.id, 'attendance-detail']);
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
