import { Component } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';

import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
})
export class ReceptionComponent {

  public dataArray=[];
  public receptionFormGroup=new FormGroup({
    PG: new FormControl(''),
    SKU: new FormControl(''),
    quantity: new FormControl(''), 
  });
  constructor(private wareventoryUC:WareVentoryUseCase,private messageService:MessageService) { 
    this.getLatesReception();
  }

  public getLatesReception(){
    this.wareventoryUC.getLog(10,"Reception").subscribe(
      (data) => {
          console.log(data)
          this.dataArray=data;
      },
      (error) => {
          console.log(error);
      }
    );
  }

  public showErrorForPG=false;
  public jobCodes=[]
  public displayJobCodes=false;

  public selectedJobCode:string;
  public selectedJobItem:string;


  public displaySKUandQuantity=false;
  public displaySearch=true;
  public displayError=false;
  public displayJobItems=false;
  public errorMessage="";
  
  public jobItems=[];

  public buscarPG(){
    
    console.log("dentro de buscarpg")
    const pgControl = this.receptionFormGroup.get('PG').value;
    console.log(pgControl);
    const pgParam = {pg: pgControl};  
    this.wareventoryUC.getJobCodesByPG(pgParam).subscribe(
      (data) => {
          console.log(data)
          console.log(data.length)
          if(data.length>0){
            this.jobCodes=data;
            this.showErrorForPG=false;
            this.errorMessage="";
            this.displayJobCodes=true;
            
          }
          else{
            this.showErrorForPG=true;
            this.displayJobCodes=false
          }
        },
      (error) => {
        this.showErrorForPG=true;
      }
    );

    if(!this.showErrorForPG){
      this.displayJobCodes=true;
    }

    
  }

  public onRowSelect(event){
    console.log("valor de variable:",this.selectedJobCode);
    if(this.selectedJobCode!==null||this.selectedJobCode!==''){
      
     

      const params={jobId:this.selectedJobCode["jobId"],pg:this.receptionFormGroup.get('PG').value}
      console.log("valor de params:",params)
      this.wareventoryUC.getJobPackagesByJobIdandPG(params).subscribe(
        (data) => {
              this.jobItems=data;
              this.displayJobItems=true;
              console.log("valor devuelta:",data)
          },
        (error) => {
          this.showErrorForPG=true;
        }
      );

    }

    
  }
  public onRowUnselect(event){
    this.selectedJobCode=null;
    this.displaySKUandQuantity=false;
  }

  public itemOnRowSelect(event){
    console.log("valor de variable:",this.selectedJobItem);
    this.displaySKUandQuantity=true;
    this.displaySearch=false;
    this.receptionFormGroup.setControl('SKU',new FormControl(this.selectedJobItem["itemSKU"]));
  }
  public itemOnRowUnselect(event){
    this.selectedJobItem=null;
  }


  public cancelarRecepcion(){
    this.displayJobCodes=false;
    this.displaySKUandQuantity=false;
    this.displaySearch=true;
    this.receptionFormGroup.reset();
    this.selectedJobCode=null;
    this.displayError=false;
    this.displayJobItems=false;

  }


  public procesarRecibir(){
    console.log("dentro de procesar recibir")
    this.displayError=false;

    for (let [key, value] of Object.entries(this.receptionFormGroup.value)) {
      console.log(`${key}: ${value}`);
      if(value===''||value===null){
       this.displayError=true;
       console.log("hay error")
       this.errorMessage="Error: Hay campos vacios";
      }
    }
    if(!this.displayError){
      console.log("valor de this.selected:",this.selectedJobCode)
      const jobCode=this.selectedJobCode["jobId"];
      
      const expectedQuantity=this.selectedJobItem["expectedQuantity"];
      const receivedQuantity=this.selectedJobItem['receivedQuantity'];

      const quantity=this.receptionFormGroup.get('quantity').value;

      console.log("valor de expectedQuantity:",expectedQuantity)
      console.log("valor de receivedQuantity:",receivedQuantity)
      console.log("valor de quantity:",quantity)
      if(parseInt(quantity)>(parseInt(expectedQuantity)-parseInt(receivedQuantity))){
        this.displayError=true;
        console.log("=================hay mas nuemro")
        this.errorMessage="Error: La cantidad recibida es mayor a la esperada";
      }
      if(this.jobCodes.find(element => element.jobId === jobCode).closed){
        this.displayError=true;
        this.errorMessage="Error: El trabajo esta cerrado";
      }
      else{
        console.log("valor de this.receptionFormGroup.value:",this.receptionFormGroup.value)
        var params={
          jobId:jobCode,
          sku:this.receptionFormGroup.get('SKU').value.toString(),
          quantity:this.receptionFormGroup.get('quantity').value,
          pg:this.receptionFormGroup.get('PG').value
        }
        console.log("parametros:",params)
        this.wareventoryUC.postReception(params).subscribe(
          (data) => {
            console.log(data)
            this.displayError=false;
            this.displayJobCodes=false;
            this.displaySKUandQuantity=false;
            this.displaySearch=true;
            this.receptionFormGroup.reset();
            this.selectedJobCode=null;
            this.selectedJobItem=null;
            this.displayJobItems=false;
            this.getLatesReception();
            this.toastMessage('success', 'Success', 'Recepcion realizada con exito');
          },
          (error) => {
            console.log(error);
            this.displayError=true;
            this.errorMessage="Error: No se pudo realizar la recepcion";
          }
        );
      }
    }
  }

  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
