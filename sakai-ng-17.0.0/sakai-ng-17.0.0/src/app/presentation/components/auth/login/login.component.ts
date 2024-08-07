import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

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

    formLogin=new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),

    });

    constructor(public layoutService: LayoutService,private wareventoryUC:WareVentoryUseCase) { }

    public procesarLogin(){
        this.wareventoryUC.executeLogin(this.formLogin.value).subscribe(
            (data) => {
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
