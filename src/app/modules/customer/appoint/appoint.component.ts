import { NzDrawerRef, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { addMonths, subMonths, format, addDays } from 'date-fns';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-appoint',
  templateUrl: './appoint.component.html',
  styleUrls: ['./appoint.component.less']
})
export class AppointComponent implements OnInit {

  @Input() studentInfo: any = {};

  dataSet: AppointData[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private modal: NzModalService
  ) { }

  maxChecked = 0;       /* ? 最大选择天数 */

  ngOnInit() {
    this.studentInfo.id = this.studentInfo.id || this.studentInfo.studentId;
    this.studentInfo.classId = this.studentInfo.classId || this.studentInfo.gradeId;
    /* 如果是日托， 则获取最大选择天数 */
    this.studentInfo.schoolRollId == 1 && this.http.post('/student/isHaveReserveTimes', { paramJson: JSON.stringify({ studentId: this.studentInfo.id }) }).then(res => this.maxChecked = res.data.surplusTimes);
    this.getData();
  }

  checkedList: string[] = [];

  getCheckedItemLoading: boolean;

  checkedChange(day: string/* reserveDate | teacherId | rowIdx */) {
    if (this.studentInfo.schoolRollId == null) {
      /* -------------------- 体验 -------------------- */
      this.checkedList = this.checkedList.includes(day) ? [] : [day];
    } else if (this.studentInfo.schoolRollId == 1) {
      /* -------------------- 日托 -------------------- */
      if (this.checkedList.length < this.maxChecked) {
        this.checkedList.includes(day) ? this.checkedList.splice(this.checkedList.indexOf(day), 1) : this.checkedList.push(day);
      }
    } else {
      /* -------------------- 定期 -------------------- */
      if (this.checkedList.includes(day)) {
        this.checkedList = [];
      } else {
        this.getCheckedItemLoading = true;

        let [startTime, teacherId, rowIndx] = day.split('|');
        this.http.post('/student/getReserveEndTime', { paramJson: JSON.stringify({ 
          studentId: this.studentInfo.id,
          startTime }) 
        }).then(res => {
          this.checkedList = [];
          for (let idx = 0; idx < res.data.days; idx++) {
            this.checkedList.push(`${format(addDays(new Date(startTime), idx), 'YYYY-MM-DD')}|${teacherId}|${rowIndx}`);
          }
          this.getCheckedItemLoading = false;
        })
      }
    }
  }

  saveLoading: boolean;
  @DrawerClose() close: (bool?) => void;

  save() {
    let checkedParams = [];
    this.checkedList.map(c => {
      let [reserveDate, teacherId, pitNum] = c.split('|');
      checkedParams.push({ 
        studentId: this.studentInfo.id, 
        reserveDate, 
        teacherId: Number(teacherId), 
        pitNum: Number(pitNum),
        reserveType: this.studentInfo.schoolRollId === null ? 3 : this.studentInfo.schoolRollId === 1 ? 1 : this.studentInfo.schoolRollId === 2 ? 0 : 2
      });
    })
    this.http.post('/reserve/checkReserveRecord', { 
      paramJson: JSON.stringify( checkedParams ) 
    }).then(res => this.modal[res.result == 1000 ? 'success' : res.result == 1001 ? 'error' : 'warning']({
      nzMaskClosable: true,
      nzTitle: res.message,
      nzContent: res.data && res.data.list ? res.data.list.join('、') : `确定预约吗`,
      nzOkText: res.result == 1001 ? null : '确定预约',
      nzOnOk: () => {
        this.getCheckedItemLoading = true;
        let url = this.studentInfo.schoolRollId == 2 ? '/reserve/longTermReserve' : '/reserve/batchSaveReserveRecord';
        let [startDate, teacherId, pitNum] = this.checkedList[0].split('|');
        let endDate = this.checkedList[this.checkedList.length - 1].split('|')[0];
        let params = this.studentInfo.schoolRollId == 2 ? {
          pitNum: pitNum,
          studentId: this.studentInfo.id,
          reserveType: 0,
          teacherId: teacherId,
          classId: this.studentInfo.classId,
          startDate,
          endDate
        } : checkedParams
        this.http.post(url, {
          paramJson: JSON.stringify(params)
        }, true).then(res => {
          if (this.studentInfo.schoolRollId == 2) {
            this.http.post('/student/updateCardInfoByReserve', {
              paramJson: JSON.stringify({
                effectDate: startDate,
                expireDate: endDate,
                classId: this.studentInfo.classId,
                teacherId,
                studentId: this.studentInfo.id
              }) }).then(res => {
              this.getCheckedItemLoading = true;
              this.close(true);
            })
          } else {
            this.close(true);
          }
        });
      },
      nzCancelText: '取消预约',
      nzOnCancel: () => { console.log('取消预约') }
    }));
  }

  async getData(type?: 'up'/* ? 上一月 */ | 'down' /* ? 下一月  */) {
    let classInfo = await this.http.post('/reserve/getClassWithTeacher', { classId: this.studentInfo.gradeId });
    /* 如查询不到做兼容处理 */
    classInfo.data.list = classInfo.data.list.length ? classInfo.data.list : [{ className: this.studentInfo.gradeName, teachers: [], receptionNum: 0}];
    let month = format(type === 'up' ? subMonths(new Date(this.dataSet[0].key), 1) : type === 'down' ? addMonths(new Date(this.dataSet[this.dataSet.length - 1].key), 1) : new Date(), 'YYYY-MM');
    this.dataSet[type === 'up' ? 'unshift' : 'push']({ key: month, value: classInfo.data.list, days: new Array(this._monthOfDays(month)) });
    
    this.dataSet[type === 'up' ? 0 : this.dataSet.length - 1].value.map(classes => {
      classes.teacherReceptionNum = 0;
      classes.teachers.map(teacher => {
        classes.teacherReceptionNum += teacher.receptionNum;
        this.http.post('/reserve/getReserveRecordByTeacher', { teacherId: teacher.id, startMonth: month.replace('-', ''), endMonth: month.replace('-', '') }).then(res => {
          teacher.list = Object.values(res.data.list)[0] ? Object.values(res.data.list)[0] : [];
          teacher.list.map(arr => teacher.list[ 'arr' + arr.pitNum] = arr);
          teacher.pit = new Array(teacher.receptionNum);
        })
      })
    });
  }

  /**
   * @function 根据年月获取该月天数
   */ 
  private _monthOfDays(d): number {
    let [y, m] = d.split('-');
    let m31 = ['01', '03', '05', '07', '08', '10', '12'];
    let m30 = ['04', '06', '09', '11'];
    return m31.includes(m) ? 31 : m30.includes(m) ? 30 : Number(y % 4) === 0 ? 29 : 28;
  }


}


interface AppointData {
  key: string;
  value: any[];
  days: any[]
}