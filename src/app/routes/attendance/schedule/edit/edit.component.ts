import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzModalRef, NzMessageService, NzEmptyService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ScheduleService } from 'app/services/schedule.service';

interface SectionDetail {
  across: number;
  beginMin: number;
  endMin: number;
  time: string;
}
interface Section {
  start: SectionDetail;
  end: SectionDetail;
}
@Component({
  selector: 'app-attendance-schedule-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class AttendanceScheduleEditComponent implements OnInit {
  serial: string;
  sectionCount = 1;
  record: any = {};
  i: any;
  sections: Section[] = [];
  startPicker: Date[] = [];
  endPicker: Date[] = [];
  startFromPicker: Date[] = [];
  startToPicker: Date[] = [];
  endFromPicker: Date[] = [];
  endToPicker: Date[] = [];
  // check variable
  lateCheck = false;
  veryLateCheck = false;
  absenceCheck = false;
  rangeChecked = false;
  isOffDutyFreeCheck = false;
  lateMin = 0;
  veryLateMin = 0;
  absenceMin = 0;
  msgOptions = {
    nzDuration: 6000,
  };
  loading = true;
  @ViewChild('customTpl') customTpl: TemplateRef<any>;
  @ViewChild('startFromPk') startFromPk;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private nzEmptySrv: NzEmptyService,
    private scheduleSrv: ScheduleService,
  ) {}

  ngOnInit(): void {
    console.info(this.record);
    if (this.record.id > 0) {
      // this.scheduleSrv.showSchedule(this.record.id).subscribe(res => {
      // });
      this.serial = this.record.serial;
      this.sections = this.record.sections;
      this.lateCheck = this.record.lateMin > 0 ? true : false;
      this.veryLateCheck = this.record.veryLateMin > 0 ? true : false;
      this.absenceCheck = this.record.absenceMin > 0 ? true : false;
      this.lateMin = this.record.lateMin;
      this.veryLateMin = this.record.veryLateMin;
      this.absenceMin = this.record.absenceMin;
      this.isOffDutyFreeCheck = this.record.isOffDutyFreeCheck;
      this.sectionCount = this.sections.length;
      for (let i = 0; i < this.sections.length; i++) {
        if (this.sections[i].start.beginMin !== 0 || this.sections[i].start.endMin !== 0) {
          this.rangeChecked = true;
        }
        if (this.sections[i].end.beginMin !== 0 || this.sections[i].end.endMin !== 0) {
          this.rangeChecked = true;
        }
        this.startPicker[i] = this.scheduleSrv.hhMmToDate(this.sections[i].start.time);
        this.endPicker[i] = this.scheduleSrv.hhMmToDate(this.sections[i].end.time);
        this.startFromPicker[i] = this.scheduleSrv.hhMmAddMinToDate(
          this.sections[i].start.time,
          this.sections[i].start.beginMin,
        );
        this.startToPicker[i] = this.scheduleSrv.hhMmAddMinToDate(
          this.sections[i].start.time,
          this.sections[i].start.endMin,
        );

        this.endFromPicker[i] = this.scheduleSrv.hhMmAddMinToDate(
          this.sections[i].end.time,
          this.sections[i].end.beginMin,
        );
        this.endToPicker[i] = this.scheduleSrv.hhMmAddMinToDate(this.sections[i].end.time, this.sections[i].end.endMin);
      }
      this.loading = false;
    } else {
      this.sections.push({
        start: {
          across: 0,
          beginMin: 0,
          endMin: 0,
          time: null,
        },
        end: {
          across: 0,
          beginMin: 0,
          endMin: 0,
          time: null,
        },
      });
      this.loading = false;
    }

    this.nzEmptySrv.setDefaultContent(this.customTpl);
    // if (this.record.id > 0) this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  close() {
    this.modal.destroy();
  }
  sectionCountChange(value) {
    console.info('selectionClicked called');
    console.info(value);
    this.sectionCount = value;
    //this.sections.length = value;
    const l = this.sections.length;
    console.info(l);
    if (l < value) {
      for (let i = 0; i < value - l; i++) {
        this.sections.push({
          start: {
            across: 0,
            beginMin: 0,
            endMin: 0,
            time: null,
          },
          end: {
            across: 0,
            beginMin: 0,
            endMin: 0,
            time: null,
          },
        });
      }
    } else {
      // for (let i = 0; i < l - value; i++) {
      //   this.sections.pop();
      // }
    }
  }
  timePickerChange(value, picker, index) {
    console.info(value);
    console.info(`${picker} ${index}`);
    if (value !== undefined) {
      const d = new Date(value);
      const timeString = d.toTimeString().split(' ')[0];
      const timeStringHHMM = timeString.substring(0, timeString.length - 3);
      console.info(timeString);
      if (picker === 'startPicker') {
        this.sections[index].start.time = timeStringHHMM;
      } else if (picker === 'endPicker') {
        this.sections[index].end.time = timeStringHHMM;
        if (this.endPicker[index].getTime() - this.startPicker[index].getTime() < 0) {
          this.sections[index].end.across = 1;
        }
      } else if (picker === 'startFromPicker') {
        const diffDate = d.getTime() - this.startPicker[index].getTime();
        const diffMin = Math.floor(diffDate / 1000 / 60);
        console.info(diffMin);
        this.sections[index].start.beginMin = diffMin;
        if (diffMin > 0 || diffMin < -60) {
          this.msgSrv.create('error', `上班打卡开始时间必须设置在开始上班前60分钟内`, this.msgOptions);
        }
      } else if (picker === 'startToPicker') {
        const diffDate = d.getTime() - this.startPicker[index].getTime();
        const diffMin = Math.floor(diffDate / 1000 / 60);
        this.sections[index].start.endMin = diffMin;
        console.info(diffMin);
        if (diffMin < 0 || diffMin > 60) {
          this.msgSrv.create('error', `上班打卡结束时间必须设置在开始上班后60分钟内`);
        }
      } else if (picker === 'endFromPicker') {
        const diffDate = d.getTime() - this.endPicker[index].getTime();
        const diffMin = Math.floor(diffDate / 1000 / 60);
        this.sections[index].end.beginMin = diffMin;
        if (diffMin < -60 || diffMin > 0) {
          this.msgSrv.create('error', `下班打卡开始时间必须设置在下班前60分钟内`);
        }
      } else if (picker === 'endToPicker') {
        const diffDate = d.getTime() - this.endPicker[index].getTime();
        const diffMin = Math.floor(diffDate / 1000 / 60);
        this.sections[index].end.endMin = diffMin;
        if (diffMin < 0 || diffMin > 60) {
          this.msgSrv.create('error', `下班打卡结束时间必须设置在下班后60分钟内`);
        }
      }
    }
    console.info(this.sections);
    console.info(this.startFromPicker[index]);
    console.info(this.startToPicker[index]);
    console.info(this.endPicker[index]);
  }
  onRangeChange(value) {
    console.info('onRangeChange');
    console.info(value);
  }
  onOffDutyCheckChange(value) {
    console.info('onOffDutyCheckChange called');
    console.info(value);
  }
  onPermitLateCheckChange(value) {
    console.info('onPermitLateCheckChange called');
    console.info(value);
  }
  // validateSections(sections: Section[] ) {
  //   let result: any[];
  //   for(let i = 0; i < sections.length; i++) {
  //     // valid
  //     if(sections[i].start.beginMin<=0 && sections[i].start.beginMin >=-60){
  //       result[i]['startFrom'] = true;
  //     } else {
  //       result[i]['startFrom'] = false;
  //     }

  //     if(sections[i].start.endMin>=0 && sections[i].start.endMin <=60){
  //       result[i]['to'] = true;
  //     } else {
  //       result[i]['to'] = false;
  //     }
  //     if(sections[i].end.beginMin<=0 && sections[i].end.beginMin >=-60){
  //       result[i]['from'] = true;
  //     } else {
  //       result[i]['from'] = false;
  //     }
  //   }
  // }
  save(value: any) {
    // this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    //   this.modal.close(true);
    // });
    const obj = {};
    if (!this.rangeChecked) {
      for (let i = 0; i < this.sections.length; i++) {
        this.sections[i].start.beginMin = 0;
        this.sections[i].start.endMin = 0;
        this.sections[i].end.beginMin = 0;
        this.sections[i].end.endMin = 0;
      }
    }
    obj['sections'] = this.sections.slice(0, this.sectionCount);
    if (this.lateCheck) {
      obj['lateMin'] = this.lateMin;
    } else {
      obj['lateMin'] = 0;
    }
    if (this.veryLateCheck) {
      obj['veryLateMin'] = this.veryLateMin;
    } else {
      obj['veryLateMin'] = 0;
    }
    if (this.absenceCheck) {
      obj['absenceMin'] = this.absenceMin;
    } else {
      obj['absenceMin'] = 0;
    }
    obj['isOffDutyFreeCheck'] = this.isOffDutyFreeCheck;
    obj['serial'] = this.serial;
    // obj['sections_des'] =
    console.info(obj);
    if (this.record.id > 0) {
      this.scheduleSrv.updateSchedule(this.record.id, obj).subscribe(res => {
        console.info(res);
        this.modal.close({ success: true });
      });
    } else {
      this.scheduleSrv.createSchedule(obj).subscribe(res => {
        console.info(res);
      });
    }
  }
}
