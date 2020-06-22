import { Component, OnInit, ViewChild,  Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { FormControl } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'ea-text-update',
  templateUrl: './text-update.component.html',
  styleUrls: ['./text-update.component.less']
})
export class TextUpdateComponent implements OnInit {
  formGroup: FormGroup;
  classList:any[];
  monthList: any[];
  @Input() Info:any = {};
  @ControlValid() valid: (key, type?) => boolean;
  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef

  ) { 

  }

  ngOnInit() {
    this.http.post('/baiKe/classification').then(res => this.classList = res.data);
    this.http.post('/baiKe/monthOld').then(res => this.monthList = res.data);
    this.formGroup = this.fb.group({
      id: [this.Info.id || null],
      title: [,[Validators.required]],
      classificationId: [,[Validators.required]],
      monthOldId: [,[Validators.required]],
      textContent: [,[Validators.required]],
    });

    if(this.Info){
      this.Info.textContent = this.Info.content;
      this.formGroup.patchValue(this.Info);
    }
 
  }
  // private _editor;
  // editorCreated(quill) {
  //   const toolbar = quill.getModule('toolbar');
  //   toolbar.addHandler('image', this._imageHandler.bind(this));
  //   this._editor = quill;
  // }
  
  // private _imageHandler() {
  //   const Imageinput = document.createElement('input');
  //   Imageinput.setAttribute('type', 'file');
  //   Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/jpg');
  //   Imageinput.classList.add('ql-image');
  //   Imageinput.addEventListener('change', () => {
  //     const file = Imageinput.files[0];
  //     let fileType = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
  //     let fileName = new Date().getTime() + `.${fileType}`;
  //     this.alioss.getClient().then(res => {
  //       res.multipartUpload(fileName, file, {}).then(res => {
  //         let imageSrc = res.url ? res.url : 'http://' + res.bucket + '.oss-cn-beijing.aliyuncs.com/' + res.name;
  //         const range = this._editor.getSelection(true);
  //         this._editor.insertEmbed(range.index, 'image', imageSrc);
  //         this.formGroup.patchValue({ textContent: this._editor.scrollingContainer.innerHTML });
  //       })
  //     })
  //   });
  //   Imageinput.click();
  // }
  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      const { title , classificationId, monthOldId, textContent ,id  } = JSON.parse(JSON.stringify(this.formGroup.value));
      const urls:string = id ? '/baiKe/update' : '/baiKe/save';
      this.http.post(urls, {
        title,
        id,
        classificationId,
        monthOldId,
        textContent
      }, true).then(res => {
          if(res.returnCode == "SUCCESS"){
            this.drawerRef.close(true)
          }
      }).catch(err => {
      });

  
    }
  }
  @DrawerClose() close: () => void;

}
