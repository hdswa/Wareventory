import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';

@Component({
  selector: 'app-transfer',
  templateUrl: './picking.component.html',
})


export class PickingComponent implements OnInit {

  
  public pickingListStatus:any[]=[];
  public pickingListCodes:string[]=[];
  public displayCodes: boolean = true;
  public pickingListItems:any[]=[];
  public emptyFormValueError: boolean = false;
  public errorMessage: string = ''; 
  public code:string="";
  public allPicked:boolean=false;

  public receptionFormGroup=new FormGroup({
    SKU: new FormControl(''),
    location: new FormControl(''),
    quantity: new FormControl(''), 
  });
  constructor(private wareventoryUC:WareVentoryUseCase){
  }

  ngOnInit(): void {
    this.initVariables()
    this.getListCodes()
  }

  initVariables(){
    this.displayCodes=true;
    this.pickingListCodes=[];
    this.getListCodes();
  }
  getListCodes(){
    
    this.wareventoryUC.getPicking("").subscribe(
      (data) => {
          console.log(data)
          this.pickingListCodes=data.map(item=>item.code);
          this.pickingListStatus=data
        },
      (error) => {
          console.log(error);
      }
    );
   
  }

  showCodeDetail(code: string): void {
   
    console.log('Code detail:', code);
    this.displayCodes=false;
    let param={code:(code as any).code}
    this.code=(code as any).code
    this.wareventoryUC.getPicking(param).subscribe(
      (data) => {
          console.log(data)
          this.pickingListItems=data;
          this.checkStatusByCode(this.code)
      },
      (error) => {
          console.log(error);
      }
    );
  }

  pickup(){
    console.log("dentro de pickup")
    console.log("valores del formulario")
    console.log(this.receptionFormGroup.value)

    const formValues = this.receptionFormGroup.value;
    for (const key in formValues) {
        if (formValues[key] === null || formValues[key] === '') {
            console.error(`Error: The value for ${key} is null or empty.`);
            this.emptyFormValueError = true;
            this.errorMessage = `Error: The value for ${key} is null or empty.`;
            return; // Exit the method if any value is null or empty
        }
    }
    
    (formValues as any).code=this.code
    this.wareventoryUC.postPicking(this.receptionFormGroup.value).subscribe(
      (data) => {
          console.log(data)
          let param={code:this.code}
          this.wareventoryUC.getPicking(param).subscribe(
            (data) => {
                console.log("valor devuelto de pickear",data)
                this.pickingListItems=data;
                this.checkStatusByList(this.code)
                
               
            },
            (error) => {
                console.log(error);
            }
          );
      },
      (error) => {
          console.log(error);
      }
    );
    
  }

  goBack(){
    this.displayCodes=true;
    this.initVariables()  
  }

  checkStatusByCode(code:string){

    let item=this.pickingListStatus.find(item=>item.code==code)

    let status=item.status
    console.log("entra en check")
    console.log("valor de code",code)
    console.log("valor de status",status)
    if(status==="Picked"){
      console.log("ha recogido todos los elemetnso")
      this.allPicked=true
      return true
    }
    else{
      this.allPicked=false
      return false
    }
  }

  checkStatusByList(code:string){
    for(let item of this.pickingListItems){
      if(!item.picked){
        return false
      }
    }
    return true
  }
  endPicking(){
    let param={code:this.code,status:"Completed"}
    this.wareventoryUC.postPicking(param).subscribe(
      (data) => {
          console.log(data)
          this.goBack()
        },
      (error) => {
          console.log(error);
      }
    );
  
  }
  
}