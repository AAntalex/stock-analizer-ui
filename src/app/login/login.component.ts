import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {catchError, first} from 'rxjs/operators';
import {AuthenticationService} from '../services/authentication.service';
import {ModalNotificationService} from '../modalNotifications/modal.notification.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationDialog: ModalNotificationService
  ) {}

  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    };
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginControl = new FormControl('', [Validators.required])
  passwordControl = new FormControl('', [Validators.required])

  // convenience getter for easy access to f fields
  get f() {
    return this.loginForm.controls;
  }

  public onSubmit() {
    console.log('Подключение к серверу...');
    this.submitted = true;

    // stop here if f is invalid
    if (this.loginForm.invalid) {
      console.log('Ошибка заполнения формы входа.');
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        }, error => {
          this.error = error;
          this.loading = false;
          if (this.error === 'Bad credentials') {
            this.notificationDialog.open('Неправильный логин или пароль!', false);
            this.error = '';
          }
        });
  }
}
