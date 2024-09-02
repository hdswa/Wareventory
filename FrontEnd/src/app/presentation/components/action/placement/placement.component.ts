import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
})
export class PlacementComponent {

  constructor(private wareventoryUC:WareVentoryUseCase,private messageService:MessageService) {

  }

  public displayError=true;
  public errorMessage="";
  public displayJobId=false;
  public displayLocation=false;
  public displaySearch=true;
  public displayLocationError=false;


  public jobDataArray=[];

  public selectedItem="";


  public SKUFormGroups=new FormGroup({
    SKU: new FormControl(''),
    location: new FormControl(''),
  });

  public searchSKU(){
    console.log('Buscando SKU');
    console.log("valor de form control: ",this.SKUFormGroups.get('SKU').value);
    this.wareventoryUC.getReceptionBascketBySKU({sku:this.SKUFormGroups.get('SKU').value}).subscribe(
      (data) => {
          console.log(data)
          if(data.length>0){
            this.displayError=false;
            this.errorMessage="";
            this.displayJobId=true;
            this.jobDataArray=data;
          }
          else{
            this.displayError=true;
            this.errorMessage="No se encontró el SKU";
            this.displayJobId=false;
          }
      },
      (error) => {
          console.log(error);
          this.displayError=true;
          this.errorMessage="Error al buscar el SKU";
          this.displayJobId=false;
      }
    );
  }


  public onRowSelect(event){
    console.log(event);
  
    if(this.selectedItem!==null||this.selectedItem!==''){
      this.displayLocation=true;
      this.displaySearch=false;
      
    }
  }
  public onRowUnselect(event){
    console.log(event);
    this.selectedItem="";
  }

  public ubicar(){
    console.log("valor de location:",this.SKUFormGroups.get('location').value);
    if(this.SKUFormGroups.get('location').value===null||this.SKUFormGroups.get('location').value===''){
      this.errorMessage="Ubicacion vacia";
      this.displayLocationError=true;
    }
    else{
      var params=this.selectedItem
      params['location']=this.SKUFormGroups.get('location').value;
      console.log("valor de params seleccionado;",params);

      this.wareventoryUC.postPlacement(params).subscribe(
        (data) => {
          console.log(data)
          this.toastMessage('success', 'Success', 'Ubicación exitosa');
          this.cancelar();
        },
        (error) => {
          console.log(error);
          this.errorMessage="Error al ubicar el SKU";
          this.displayError=true;
        }
      );

      this.cancelar();

    }
  }
  public cancelar(){

    this.errorMessage="";
    this.displayError=false;
    this.displayLocationError=false;
    this.displayJobId=false;
    this.displaySearch=true;
    this.displayLocation=false;
    this.SKUFormGroups.reset();

  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
