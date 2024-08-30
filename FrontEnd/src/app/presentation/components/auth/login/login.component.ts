import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;

    loginError:boolean=false;
    loginErrorMessage:string="";

    formLogin=new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),

    });

    constructor(public layoutService: LayoutService,private wareventoryUC:WareVentoryUseCase,private router:Router) { }

    public procesarLogin(){
        this.wareventoryUC.executeLogin(this.formLogin.value).subscribe(
            (data) => {
                // console.log(data);
                console.log("valore de token:",data.token);

                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', this.formLogin.value.username);

                this.router.navigate(['/']);

                this.loginError=false;
                this.loginErrorMessage="";
                
            },
            (error) => {
                console.log(error);
                this.loginError=true;
                this.loginErrorMessage="Usuario o contraseña incorrectos";
            }
        );
    }
}
