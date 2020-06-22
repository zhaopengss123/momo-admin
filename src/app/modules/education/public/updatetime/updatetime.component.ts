import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
@Component({
  selector: 'app-updatetime',
  templateUrl: './updatetime.component.html',
  styleUrls: ['./updatetime.component.less']
})
export class UpdatetimeComponent implements OnInit {
  @Input() classId;
  classList: any[] = [];
  editName: string;
  listOfData: any[] = [];
  listCourse: any[] = [];
  saveLoading: boolean = false;
  modeClassId: number;
  listClass: any[] = [];
  @Input() id;
  constructor(
    private message: NzMessageService,
    private http: HttpService,
    private drawerRef: NzDrawerRef
  ) { 

  }
  ngOnInit() {
    this.getData(null);
    this.http.post('/course/listCourseType', {}).then(res => {
      this.listCourse = res.data.list;
    });
    this.http.post('/message/listClassMessage', {}, false).then(res => { this.listClass = res.data.list;});

  }
  uploadResult: any[] = [];
  uploadInfo: string;

  uploadComplate(e) {
    if (e.type === 'start') {
      this.uploadResult = [];
    }
    if (e.type === 'success') {
      this.message.create(e.file.response.result == 1000 ? 'success' : 'warning', e.file.response.message);
      if (e.file.response.result == 1000) {
        this.message.success(e.file.response.message || '操作成功');
      } else {
        this.uploadResult = e.file.response.data.errorClues;
        this.uploadInfo = `本次上传结果（${e.file.response.message}）`;
      }
    }
  }
  selectMode(){
    this.getData(this.modeClassId);
  }
  getData(modeClassId) {
    this.http.post('/courseConfig/getCourseDayTemplateByPlanId', { planId: this.id , classId: modeClassId || this.classId }).then(res => {
      res.data.list.map(item => {
        item.startHour = item.startHour > 9 ? item.startHour : '0' + item.startHour;
        item.startMinute = item.startMinute > 9 ? item.startMinute : '0' + item.startMinute;
        item.endHour = item.endHour > 9 ? item.endHour : '0' + item.endHour;
        item.endMinute = item.endMinute > 9 ? item.endMinute : '0' + item.endMinute;
        item.startTime = new Date('2019-01-01 ' + item.startHour + ':' + item.startMinute);
        item.endTime = new Date('2019-01-01 ' + item.endHour + ':' + item.endMinute);
        item.status = item.courseTypes ? true : false;
        item.courseTypes = item.courseTypes ? JSON.parse(item.courseTypes) : {};
      })
      this.listOfData = res.data.list;
    });
  }
  addTime() {
    let list = JSON.parse(JSON.stringify(this.listOfData));
    let json = {
      fromName: '',
      edit: true,
      courseTypes: {}
    };
    list.map(item=>{
      item.startTime = new Date(item.startTime);
      item.endTime = new Date(item.endTime);
    })
    list.push(json);
    this.listOfData = list;
  }
  
  addList(data, index) {
    let list = JSON.parse(JSON.stringify(this.listOfData));
    let json = {
      fromName: '',
      edit: true,
      courseTypes: {}
    };
    list.map(item=>{
      item.startTime = new Date(item.startTime);
      item.endTime = new Date(item.endTime);
    })
    list.splice(index + 1, 0, json);

    this.listOfData = list;
  }
  delete(data) {
    this.http.post('/course/updateCourseType', {
      paramJson: JSON.stringify({
        id: data.id,
        status: -1
      })
    }).then(res => {
      if (res.returnCode == "SUCCESS") {
        this.message.success('操作成功');
        data.edit = false;
        this.getData(this.modeClassId);
      } else {
        this.message.warning(res.returnMsg);
      }
    });
  }
  close() {
    this.drawerRef.close(false);
  }
  saves() {
    let params = JSON.parse(JSON.stringify(this.listOfData))
    params.map(item => {
      item.courseTypes = item.status ? item.courseTypes : null;
      item.planId = this.id;
      let startTime = new Date(item.startTime);
      item.startHour = startTime.getHours();
      item.startMinute = startTime.getMinutes();
      let endTime = new Date(item.endTime);
      item.endHour = endTime.getHours();
      item.endMinute = endTime.getMinutes();
      item.classId = this.classId;
    })
    let isbreak = false;
    for (var i = 0; i < params.length; i++) {
      if (params[i].edit) {
        this.message.warning(`请先保存时段后再操作`);
        isbreak = true
        break;
      }
      if (i != params.length - 1) {
        if (params[i].endHour != params[i + 1].startHour || params[i].endMinute != params[i + 1].startMinute) {
          this.message.warning(`${params[i].name}的结束时间和${params[i + 1].name}的开始时间必须相同`);
          isbreak = true
          break;
        }
      }
    }
    if (!isbreak) {
      this.http.post('/courseConfig/saveCourseDayTemplate', {
        paramJson: JSON.stringify(params)
      }, true).then(res => {
        if (res.returnCode == "SUCCESS") {
          this.drawerRef.close(true);
        } else {
          this.message.warning(res.returnMsg);
        }
      });
    }

  }
  updatelistok(data) {
    if (!data.name) {
      this.message.warning(`名称不能为空！`);
      return false;
    }
    if (!data.startTime || !data.startTime) {
      this.message.warning(`开始时段和结束时段不能为空！`);
      return false;
    }
    if (!data.content) {
      this.message.warning(`内容不能为空！`);
      return false;
    }
    if (data.status) {
      if (!(data.courseTypes && data.courseTypes[1] && data.courseTypes[2] && data.courseTypes[3] && data.courseTypes[4] && data.courseTypes[5])) {
        this.message.warning(`课程类型不能为空！`);
        return false;
      }
    }
    data.edit = false;
  }
  cancel(data, i) {
    if (!data.id) {
      this.listOfData.splice(i, 1);
    } else {
      this.listOfData[i].edit = false;
    }
  }
  delectList(data, i) {

    let list = JSON.parse(JSON.stringify(this.listOfData));
    let isbreak = false;
    for (let x = 0; x < list.length; x++) {
      if (list[x].edit) {
        this.message.warning(`请先保存时段后再操作`);
        isbreak = true
        break;
      }
    }
    if (isbreak) { return false;}
    list.splice(i, 1);
    list.map(item=>{
      item.startTime = new Date(item.startTime);
      item.endTime = new Date(item.endTime);
    })
    this.listOfData = list;
  }


}
