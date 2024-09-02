import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transfer',
  templateUrl: './shipping.component.html',
})


export class ShippingComponent implements OnInit{

  public shippingList:any[]=[];
  public shippingListCodes:string[]=[];
  public code:string="";
  public totalItems:number=0; 
  public scannedItems:number=0;
  public scannedItemValue:string="";
  public errorMessage="";
  public displayScannedItemError:boolean=false;
  public displayCodes: boolean = true;  
  public scannedItemControl = new FormControl('');
  public endOption:boolean=false;

  constructor(private wareventoryUC:WareVentoryUseCase,private messageService:MessageService) {
  
  }

  ngOnInit(): void {
    
   this.initVariables()
  }

  initVariables(){
    this.scannedItems=0;
    this.totalItems=0;
    this.displayScannedItemError=false;
    this.errorMessage="";
    this.displayCodes=true;
    this.shippingListCodes=[];
    this.getListCodes();
  }

  getListCodes(){
      
      this.wareventoryUC.getShipping("").subscribe(
        (data) => {
            // console.log(data)
            this.shippingList=data
            this.shippingListCodes=data.map(item=>item.code);
            // console.log("valor de shippingListCode",this.shippingListCodes)
            console.log("valor de shippingList",this.shippingList)
          },
        (error) => {
            console.log(error);
        }
      );
  }

 
  showCodeDetail(code: string): void {
   
    console.log('Code detail:', code);
    this.displayCodes=false;
    this.code=code
    this.shippingList.forEach((item)=>{
      if(item.code==code){
        for(let i of item.items){
          console.log("valor de itmes",i)
          this.totalItems+=i.quantity

        }
        if(this.totalItems<=0){
          this.endOption=true;
        }
      }
    })
  }
  goBack(){
    this.displayCodes=true;
    this.initVariables()  
  }

  scanItem(): void {
    const scannedItemValue = this.scannedItemControl.value;
    console.log("valor de scannedItems", scannedItemValue);

    this.getListCodes()
    let codeList = this.shippingList.filter(item => item.code == this.code);
    console.log("valor de codeList", codeList);
    for (let item of codeList[0].items) {
      if (item.SKU == scannedItemValue) {
        console.log("los valores son iguales");
        console.log("valor de item", item.packed);
        if(!item.packed){
          
          console.log("valor correcto y corresponde");
          this.scannedItemControl.setValue('');
          this.scannedItems++;
          let param={"code":this.code,"SKU":scannedItemValue}
          console.log("valor de param",param)
          this.wareventoryUC.postShipping(param).subscribe(
            (data) => {
                console.log(data)
                this.getListCodes()
                if(this.totalItems<=this.scannedItems){
                  this.endOption=true;
                }
                
              },
            (error) => {
                console.log(error);
            }
          );
            
        }
        else{
          this.displayScannedItemError=true;
          this.errorMessage="El item ya fue escaneado"
        }
        
        break; 
      }
    }
  }

  endShipping(){
    console.log("terminando shipping")
    let param={"code":this.code,"operation":"delete"}
    
    this.wareventoryUC.postShipping(param).subscribe(
      (data) => {
          console.log(data)
          this.goBack()
          this.toastMessage('success', 'Success', 'Shipping completed successfully');
        },
      (error) => {
          console.log(error);
      }
    );
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
  
}
