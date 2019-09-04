import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { CustomUploadAdapterPlugin } from './fileupload.ckeditor';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

declare const OSS;
@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  
  config;

  formGroup: FormGroup;

  teacherList: any[] = [];
  classList: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder()
  ) {
    this.config = {
      // 配置语言
      language: 'zh-cn',
      http,
      extraPlugins: [CustomUploadAdapterPlugin]
    };
    this.formGroup = this.fb.group({
      noticeTitle: [, [Validators.required]],
      noticeCover: [, [Validators.required]],
      content: [, [Validators.required]],
      checkedTeacher: [, [this._requiredValidator]],
      checkedStudent: [, [this._requiredValidator]],
      acceptPerson: ['']
    });
    this.formGroup.get('checkedTeacher').valueChanges.subscribe(res => {
      if (res) {
        this.formGroup.addControl('sendAllTeacher', this.fb.control(true));
        this.formGroup.get('sendAllTeacher').valueChanges.subscribe(isAll => {
          isAll ? this.formGroup.removeControl('teacherSelect') : this.formGroup.addControl('teacherSelect', this.fb.control(null, [Validators.required]));
        })
      } else {
        this.formGroup.removeControl('sendAllTeacher');
      }
    });
    this.formGroup.get('checkedStudent').valueChanges.subscribe(res => {
      if (res) {
        this.formGroup.addControl('sendAllStudent', this.fb.control(true));
        this.formGroup.get('sendAllStudent').valueChanges.subscribe(isAll => {
          isAll ? this.formGroup.removeControl('studentSelect') : this.formGroup.addControl('studentSelect', this.fb.control(null, [Validators.required]));
        })
      } else {
        this.formGroup.removeControl('sendAllStudent');
      }
    });
  }

  ngOnInit() {
    this.http.post('/message/getTeacherList', {}, false).then(res => this.teacherList = res.data);
    this.http.post('/classmanager/listClassMessage', {}, false).then(res => this.classList = res.data.list);
  }
  
  @DrawerClose() close: () => void;

  saveLoading: boolean;
  async save() {
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      let content = await this._contentBase64ToAliyunOss(params.content);
      params.content = content;
      if (params.checkedTeacher) {
        if (params.sendAllTeacher) {
          params.teacherSelect = 'all';
          params.acceptPerson += '全部老师';
        } else {
          params.teacherSelect = params.teacherSelect.join(',');
          let acceptPerson = [];
          this.teacherList.map(teacher => this.formGroup.value.teacherSelect.map(id => id === teacher.id && acceptPerson.push(teacher.name)));
          params.acceptPerson += acceptPerson.join(',');
        }
      }
      if (params.checkedTeacher && params.checkedStudent) {
        params.acceptPerson += ',';
      }
      if (params.checkedStudent) {
        if (params.sendAllStudent) {
          params.studentSelect = 'all';
          params.acceptPerson += '全部家长';
        } else {
          params.studentSelect = params.studentSelect.join(',');
          let acceptPerson = [];
          this.classList.map(cls => this.formGroup.value.studentSelect.map(id => id === cls.id && acceptPerson.push(cls.className)));
          params.acceptPerson += acceptPerson.join(',');
        }
      }
      this.http.post('/settings/notice/publishNotice', { paramJson: JSON.stringify(params) }).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }

  private _requiredValidator = (control): { error: boolean } | null => {
    return control.root.controls && !control.root.controls['checkedTeacher'].value && !control.root.controls['checkedStudent'].value ? { error: true } : null;
  }


  private _contentBase64ToAliyunOss(editorContent): Promise<any> {
      return new Promise((resolve, reject) => {
        let dom = document.createElement('div');
        dom.innerHTML = editorContent;
        let imgs = dom.getElementsByTagName('img');
        let uploadNum = 0;
        if (imgs.length) {
          const _this_ = this;
          this.http.get('http://oss.haochengzhang.com/oss/getOSSToken?type=1', {}, false).then(res => {
            if (res.result == 0) {
              let creds = res.data;
              let client = new OSS.Wrapper({
                region: 'oss-cn-beijing',
                accessKeyId: creds.accessKeyId,
                accessKeySecret: creds.accessKeySecret,
                stsToken: creds.securityToken,
                bucket: 'ylbb-business'
              });
              for (let i = 0; i < imgs.length; i++) {
                (function (i) {
                  // 获取到 base64 格式的图片
                  const ImageURL = imgs[i].src
                  if (ImageURL.substr(0, 4) == 'http') {
                    uploadNum++;
                    _this_.getContentComplate(imgs.length, uploadNum, dom).then(res => { resolve(res) }).catch(err => { });
                    return;
                  }
                  // 将 base64 图片转换成 blob 流
                  const block = ImageURL.split(";");
                  const contentType = block[0].split(":")[1];
                  const realData = block[1].split(",")[1];
                  var blob = _this_.b64toBlob(realData, contentType);
                  // blob 转 arrayBuffer
                  var reader = new FileReader();
                  reader.readAsArrayBuffer(blob);
                  reader.onload = function (event: any) {
                    // arrayBuffer转Buffer
                    var buffer = new OSS.Buffer(event.target.result);
                    client.put(`${new Date().getTime()}-${i}.${contentType.split('/')[1]}`, buffer).then(function (result) {
                      imgs[i].src = result.url;
                      uploadNum++;
                      _this_.getContentComplate(imgs.length, uploadNum, dom).then(res => { resolve(res) }).catch(err => { });
                    }, err => {
                      reject('上传图片失败，请重新上传');
                    });
                  }
                })(i)
              }
            }
          });
          setTimeout(() => {
            reject('上传图片超时，建议重新上传')
          }, 20 * 1000);
        } else {
          resolve(editorContent);
        }

      })
  }

  private getContentComplate(imgsLength, currentLoadLength, dom): Promise<string> {
    return new Promise((resolve, reject) => {
      if (imgsLength === currentLoadLength) {
        resolve(dom.innerHTML);
      } else {
        reject('图片未全部上传完毕')
      }
    })
  }
  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
