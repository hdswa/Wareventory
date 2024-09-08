import { Component } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
})


export class NewJobComponent {
  public newJobForm =new FormGroup({
    jobId: new FormControl(''),
    jobSupplier: new FormControl(''),
    jobComment: new FormControl(''),
  });

  public jobPackagesForm =new FormGroup({
    PG: new FormControl(''),
    SKU: new FormControl(''),
    quantity: new FormControl(''),
  });

  public jobPackages:any[]=[];
  public displayDialog: boolean = false;
  public displayJSONdialog: boolean = false;
  public packageJSON:any;
  public itemJSONlist: any[] = [];

  constructor(private wareventoryUC: WareVentoryUseCase,private messageService:MessageService,private translateService:TranslateService) { 
    this.translateService.use(sessionStorage.getItem('language'));
  }

  addJob(){
 
    var param=this.newJobForm.getRawValue();

    if(param.jobId=='' || param.jobSupplier==''|| param.jobComment==''){
      this.toastMessage('error','Error','Por favor llene todos los campos');
      return;
    }
    (param as any).jobSize = this.jobPackages.length;
    (param as any).closed=false;

    console.log(param);
    this.wareventoryUC.addJob(param).subscribe(
      (data) => {
          console.log(data)
          this.toastMessage('success','Nuevo Job','Job añadido correctamente');
          this.newJobForm.reset();
      },
      (error) => {
          console.log(error);
          this.toastMessage('error','Error','Error al añadir el Job');
      }   
    );

    if(this.jobPackages.length>0){
      
        let element = {"jobId":param.jobId,"packages":this.jobPackages};
        this.wareventoryUC.addJobPackage(element).subscribe(
          (data) => {
              console.log(data)
              this.newJobForm.reset();
          },
          (error) => {
              console.log(error);
              this.toastMessage('error','Error','Error al añadir los paquetes');
              return;
          }
        );
        this.toastMessage('success','Nuevo Job','Paquetes añadidos correctamente');
      
    }
  }

  toastMessage(severity:string,summary:string,detail:string) {
    this.messageService.add({severity:severity, summary:summary, detail:detail});
  }
  showDialog() {
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  showJSONdialog() {
    this.displayJSONdialog = true;
  }
  hideJSONdialog() {
    this.displayJSONdialog = false;
  }
  deleteRow(rowData: any) {
    this.jobPackages = this.jobPackages.filter(job => job !== rowData);
  }
  addJobPackage(){
    let param=this.jobPackagesForm.getRawValue();
    if(!this.checkNumberFormat()){
      return;
    }
    if(param.PG=='' || param.SKU==''|| param.quantity==''){
      this.toastMessage('error','Error','Por favor llene todos los campos');
      return;
    }
    this.jobPackages.push(this.jobPackagesForm.getRawValue());
    console.log(this.jobPackages);
  
  }

  checkNumberFormat():boolean{
    console.log("dentro de checkNumberFormat");
    try{
      console.log("valor de quantity: "+(this.jobPackagesForm.get('quantity')as any).value);
      if((this.jobPackagesForm.get('quantity')as any).value<0){
        this.toastMessage('error','Error','La cantidad no puede ser negativa');
        this.jobPackagesForm.get('quantity').setValue('');
        return false;

      }
      //if a character is inputed into a type number input, it will return null
      else if((this.jobPackagesForm.get('quantity')as any).value==null){
        this.toastMessage('error','Error','La cantidad no puede contener caracteres');
        return false;
      }
      return true;
    }catch(e){
        this.toastMessage('error','Error','La cantidad no puede contener caracteres');
        return false;
    }
  }
  addJobPackageByJSON(){
    try{
      this.packageJSON=JSON.parse(this.packageJSON);
      console.log(this.packageJSON);
      if(!Array.isArray(this.packageJSON)){
        this.toastMessage('error','Error','JSON no válido');
        return;
      }
      if(this.packageJSON.length<1){
        this.toastMessage('error','Error','JSON no válido, longitud menor a 1');
        return;
      }
      for(let i=0;i<this.packageJSON.length;i++){
        if(this.packageJSON[i].PG=='' || this.packageJSON[i].SKU==''|| this.packageJSON[i].quantity==''){
          this.toastMessage('error','Error','Por favor llene todos los campos');
          return;
        }
        if(this.packageJSON[i].quantity<0 || isNaN(this.packageJSON[i].quantity)){
          this.toastMessage('error','Error','La cantidad no puede ser negativa o ser un caracter');
          return;
        }
      }
 
      this.jobPackages=[];
      this.jobPackages=this.packageJSON;
      this.packageJSON=""
      this.hideJSONdialog();
  }catch(e){
    console.log(e);
    this.toastMessage('error','Error','JSON no válido, error en el formato'+e);
  }

  }
}
