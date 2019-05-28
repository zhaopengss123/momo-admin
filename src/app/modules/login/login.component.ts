import { NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { serialize } from 'src/app/core/http.intercept';
import { RouterState } from 'src/app/core/reducers/router-reducer';
import { AppState } from 'src/app/core/reducers/reducers-config';

declare const CryptoJS;

declare const hex_md5: (s: string) => string;

@Component({
  selector: 'ea-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;

  loginLoading: boolean;

  loginError: string = '';

  private baseRouter: RouterState;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder = new FormBuilder(),
    private store: Store<AppState>,
    private modal: NzModalService
  ) {
    this.store.select('routerState').subscribe(res => this.baseRouter = res);
  }

  ngOnInit() {
    this.modal.closeAll();

    /* ------------------- 判断本地是否存储用户名密码 ------------------- */
    try {
      let userName = window.localStorage.getItem('userName') ? JSON.parse(window.localStorage.getItem('userName')) : {};
      this._loginFormInit(userName);
    } catch (e) {
      this._loginFormInit();
    }
  }


  /* ------------------------- 初始化模型表单 ------------------------- */
  _loginFormInit(obj: object = {}): void {
    this.loginForm = this.fb.group({
      userName: [obj['userName'] || '', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      password: [obj['password'] || '', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      remember: [true]
    });
    this.loginForm.valueChanges.subscribe(res => {
      this.loginError = '';
    })
  }


  /* ----------------------------- 登录 ----------------------------- */
  _submit() {
    for (let i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
    }

    if (this.loginForm.valid) {
      this._login();
    }
  }
  private _login(): void {
    if (this.loginLoading) { return; }
    this.loginLoading = true;
    /* --------- 根据authCode是否存在,判断是否为免密登录 --------- */
    let params = JSON.parse(JSON.stringify(this.loginForm.value));
    params.password = hex_md5(params.password).toLocaleUpperCase();
    this.http.post<any>('/login/auth', serialize({ paramJson: JSON.stringify(params) }), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    }).subscribe(res => {
      this.loginLoading = false;
      if (res.result == 1000) {
        /* ------------------ 存储用户名密码及用户信息 ------------------ */
        window.localStorage.setItem('userInfo', JSON.stringify(res.data));
        this.store.dispatch({ type: 'setUserInfo', payload: res.data });
        if (params.remember) {
          window.localStorage.setItem('userName', JSON.stringify(this.loginForm.value));
        }
        this.router.navigateByUrl('/home/index');
      } else {
        this.loginError = res.message;
      }
    }, err => {
      this.loginLoading = false;
    })
  }

  /* ------------------------ AES加密 ------------------------ */
  private key: string;             // 秘钥
  _encrypt(str: string): string {
    var key = CryptoJS.enc.Utf8.parse(this.key);
    var srcs = CryptoJS.enc.Utf8.parse(str);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }

}
