import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
})


export class TransferComponent {

  public transferFormGroup =new FormGroup({
    origin: new FormControl(''),
    destination: new FormControl(''),
    transferQuantity: new FormControl(''),
  });

  constructor(private wareventoryUC:WareVentoryUseCase,private messageService:MessageService) {
  }

  public displaySearch=true;
  public displayError=false;
  public displayLocationError=false;
  public errorMessage="";

  public displayItemList=false;
  public itemListArray=[];
  public selectedItem="";

  public displayDestination=false;

  public searchItems(){
    console.log("dentro de procesarBusqueda")
    const originControl = this.transferFormGroup.get('origin').value;
    console.log(originControl);
    if(originControl===null||originControl===""){
      this.displayError=true;
      this.errorMessage="El campo origen no puede estar vacio";
    }
    else{
      this.displayError=false;
      this.errorMessage="";

      this.wareventoryUC.getLocationItems({location:originControl}).subscribe(
        (data) => {
            console.log(data)
            this.itemListArray=data;
        },
        (error) => {
            console.log(error);
        }
      );
      this.displayItemList=true;

    }
  }


  itemOnRowSelect(event){

    console.log(event);
    this.selectedItem=event.data;
    console.log(this.selectedItem);
    this.displayDestination=true;
    
  }

  itemOnRowUnselect(event){

  }

  transferItem(){
    

    const origin=this.transferFormGroup.get('origin').value;
    const destination=this.transferFormGroup.get('destination').value;
    const transferQuantity=this.transferFormGroup.get('transferQuantity').value;
    const quantity=this.selectedItem["quantity"];
    if(origin===destination){
      this.displayLocationError=true;
      this.errorMessage="El origen y el destino no pueden ser iguales";
    }
    else if(transferQuantity>quantity){
      this.displayLocationError=true;
      this.errorMessage="El valor introducido excede la cantidad existete";
    }
    else{
    var params={
      location_origin:origin,
      location_destination:destination,
      itemSKU:this.selectedItem["SKU"],
      quantity:parseInt(transferQuantity)
    }


    this.wareventoryUC.postTransfer(params).subscribe(
      (data) => {
          console.log(data)
          this.displaySearch=true;
          this.displayDestination=false;
          this.displayItemList=false;
          this.transferFormGroup.get('origin').setValue('');
          this.transferFormGroup.get('destination').setValue('');
          this.transferFormGroup.get('transferQuantity').setValue('');
          this.displayError=false;
          this.displayLocationError=false;
          this.toastMessage('success', 'Success', 'Transferencia exitosa');
          

      },
      (error) => {
          console.log(error);
      }
    );
    this.displayError=false;
    this.displayLocationError=false;
  }
  }

  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }



}
