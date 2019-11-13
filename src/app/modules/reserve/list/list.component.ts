import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { environment } from 'src/environments/environment';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-reserve',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ReserveComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  domain = environment.domainEs;

  queryNode: QueryNode[] = [
    {
      label   : '学员',
      key     : 'studentId',
      type    : 'search',
      placeholder: '根据学号、姓名、手机号查询',
      searchUrl: `${this.domain}/czg/fullQuery`
    },
    {
      label       : '预约时间',
      type        : 'datepicker',
      key         : 'reserveDate',
      default     : new Date()
    },
    {
      label       : '班级',
      key         : 'classId',
      type        : 'select',
      optionKey   : { label: 'className', value: 'id' },
      optionsUrl  : '/message/listClassMessage'
    },
    {
      label       : '老师',
      key         : 'teacherId',
      type        : 'select',
      optionKey   : { label: 'name', value: 'id' },
      optionsUrl  : '/message/getTeacherList'
    },
    {
      label       : '学员类型',
      key         : 'reserveType',
      type        : 'select',
      options     : [ { name: '长期', id: 0 }, { name: '日托', id: 1 }, { name: '体验', id: 3 } ]
    },
    {
      label       : '预约状态',
      key         : 'reserveStatus',
      type        : 'select',
      options     : [ { name: '未到校', id: 0 }, { name: '已到校', id: 1 }, { name: '已离校', id: 2 } , { name: '请假', id: 3 }, { name: '已撤销', id: 4 } ]
    }
  ];

  paramsDefault;

  weilaiForm: FormGroup;
  weilaiOptionList: any[] = []

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private format: DatePipe,
    private fb: FormBuilder = new FormBuilder(),
    private message: NzMessageService
  ) { 
    this.paramsDefault = {
      reserveDate: this.format.transform(new Date(), 'yyyy-MM-dd'),
    };
    this.weilaiForm = this.fb.group({
      weilai: []
    })
    
    this.http.post('/reserve/getWeeks').then(res => {
      res.data.list.map(item => this.weilaiOptionList.push({ name: item.week, id: new Date(item.date) }));
      this.weilaiOptionList[0].name = '今天';
      this.weilaiForm.patchValue({ weilai: this.weilaiOptionList[0].id })
      this.weilaiForm.get('weilai').valueChanges.subscribe(res => {
        if (res) {
          this.listPage.eaTable.request({ reserveDate: this.format.transform(res, 'yyyy-MM-dd') })
          this.listPage.eaQuery._queryForm.patchValue({ reserveDate: res })
        }
      })
    });
  }
 
  ngOnInit() {
    
  }
  
  openDiary(data){
    let token = JSON.parse(localStorage.getItem('userInfo')).token;    
    this.http.post('/daily/get', {  studentId: data.studentId, queryDate: data.reserveDate  }).then(res => {
        if(res && res.data.contentJson){
            window.open(`http://wx.haochengzhang.com/ylbb-activity-memberdetail/?studentId=${ data.studentId }&queryDate=${ data.reserveDate }&token=${ token }`);
        }else{
          this.message.warning('该学员未生成成长日记');
          }
    })
  }
  withdraw(id) {
    this.http.post('/reserve/withdrawReserve', { reserveId: id}).then(res => {
      this.listPage.eaTable._request();
    }) 
  }

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number }) => void;

}
