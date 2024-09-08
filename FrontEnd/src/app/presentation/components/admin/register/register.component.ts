import { Component, OnInit } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { Router } from '@angular/router';
import { FormGroup,FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit{

  constructor(private wareventoryUC: WareVentoryUseCase,private router:Router,private messageService:MessageService,private translateService:TranslateService) {
    this.translateService.use(sessionStorage.getItem('language'));
   }

  public roles=[
    {label:'Administrador',value:'admin'},
    {label:'Usuario',value:'user'}
  ]
  ngOnInit(): void {
   
  }
  public registerFormGroup =new FormGroup({
    code: new FormControl(''),
    password1: new FormControl(''),
    password2: new FormControl(''),
    role: new FormControl(''),
    dni: new FormControl(''),
    name: new FormControl(''),
  });

  public displayError=false;
  public errorMessage="";
  

  register(){

    if(this.registerFormGroup.get('password1').value!=this.registerFormGroup.get('password2').value){
      this.displayError=true;
      this.errorMessage="Las contraseñas no coinciden";
    }
    else{
      this.displayError=false;
      this.errorMessage="";
      this.wareventoryUC.postRegister({
        code:this.registerFormGroup.get('code').value,
        password:this.registerFormGroup.get('password1').value,
        role:this.registerFormGroup.get('role').value,
        dni:this.registerFormGroup.get('dni').value,
        name:this.registerFormGroup.get('name').value
      }).subscribe(
        (data) => {
            console.log(data)
            this.toastMessage('success','Registro','Usuario registrado correctamente');
            this.registerFormGroup.reset();
            // this.router.navigate(['/']);
        },
        (error) => {
            console.log(error);
            this.displayError=true;
            this.errorMessage="Hubo un error en el registro";
        }
      );
    }

  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
