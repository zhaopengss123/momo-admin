import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { subMonths, addMonths, format, getDay } from 'date-fns';

@Component({
  selector: 'app-reserve-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class ReservePreviewComponent implements OnInit {

  dataSet: any[] = [];

  today = this.format.transform(new Date(), 'yyyy-MM-dd');

  classList: any[] = [];

  getCheckedItemLoading: boolean;

  classForm: FormGroup = new FormGroup({
    classId: new FormControl(null)
  })
  constructor(
    private http: HttpService,
    private format: DatePipe,
  ) { 
    this.classForm.controls['classId'].valueChanges.subscribe(classId => {
      this._classInfo = null;
      this.dataSet  = [];
      this.getData(null, classId);
    })
    this.http.post('/message/getClasses').then(res => {
      this.classList = res.data;
      this.classForm.patchValue({ classId: this.classList[0].id });
    });
  }

  ngOnInit() {
  }

  private _classInfo;
  async getData(type?: 'up'/* ? 上一月 */ | 'down' /* ? 下一月  */, classId?) {
    let classInfo = this._classInfo || await this.http.post('/reserve/getClassWithTeacher', { classId });
    this._classInfo = classInfo;
    /* 如查询不到做兼容处理 */
    classInfo.data.list = classInfo.data.list.length ? classInfo.data.list : [{ className: '贝壳班', teachers: [], receptionNum: 0 }];
    let month = format(type === 'up' ? subMonths(new Date(this.dataSet[0].key), 1) : type === 'down' ? addMonths(new Date(this.dataSet[this.dataSet.length - 1].key), 1) : new Date(), 'YYYY-MM');
    this.dataSet[type === 'up' ? 'unshift' : 'push']({ key: month, value: JSON.parse(JSON.stringify(classInfo.data.list)), days: new Array(this._monthOfDays(month)) });

    this.dataSet[type === 'up' ? 0 : this.dataSet.length - 1].value.map(classes => {
      classes.teacherReceptionNum = 0;
      classes.teachers.map(teacher => {
        classes.teacherReceptionNum += teacher.receptionNum;
        this.http.post('/reserve/getReserveRecordByTeacher', { teacherId: teacher.id, startMonth: month.replace('-', ''), endMonth: month.replace('-', '') }).then(res => {
          teacher.list = Object.values(res.data.list)[0] ? Object.values(res.data.list)[0] : [];
          teacher.list.map(arr => teacher.list['arr' + arr.pitNum] = arr);
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


  private _weekList = ['日', '一', '二', '三', '四', '五', '六'];
  getDate(day) {
    return this._weekList[getDay(new Date(day))] || '';
  }

  getReserveLoading: boolean;
  getReserveInfo(students: { id, type }[], reserveDate) {
    if (!this.getReserveLoading) {
      this.getReserveLoading = true;
      let studentIds = [];
      students.map(s => studentIds.push(s.id))
      studentIds = Array.from(new Set([...studentIds]));
      this.http.post('/student/showStudentCardInfo', { paramJson: JSON.stringify({ studentIds: studentIds.join(',') }) }).then(res => {
        if (res.returnCode == "SUCCESS") {
          let innerHTML = [];
          res.data.list.map(student => {
            innerHTML.push(`<li>
              <div><label>姓名:</label><span>${student.studentName}</span></div>
              <div><label>类型:</label><span>${student.type == 2 && !student.effectDate ? '体验' : student.type == 2 ? '定期' : student.type == 1 ? '日托' : '体验'}</span></div>
              ${student.type == 2 && student.effectDate ? `
                <div><label>开始时间:</label><span>${student.effectDate}</span></div>
                <div><label>结束时间:</label><span>${student.expireDate}</span></div>
              ` : `
                <div><label>时间:</label><span>${reserveDate}</span></div>
              `}
            </li>`)
          })
          students['innerHTML'] = `<ul>${innerHTML.join('')}</ul>`;
        } else {
          students['innerHTML'] = '数据库无此学员数据';
        }
        setTimeout(() => {
          this.getReserveLoading = false;
        })
      })
    }
  }


  
}
