import { Component } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { MessageService } from 'primeng/api';
import { FormGroup,FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-admin-shipping-list',
  templateUrl: './admin-shipping-list.component.html',
})
export class AdminShippingListComponent {


  public pickingList: any[]= [];
  public displayDialog: boolean = false;
  public displayObjectDialog: boolean = false;
  public displayJSONdialog: boolean = false;

  public filterText: string = '';
  public filteredPickingList: any[]= [];

  public pickingListItems: any[] = []
  public newPickingListCode: string = "";
  public itemJSONlist: any;

  public newItemForm=new FormGroup({
    SKU: new FormControl(''),
    quantity: new FormControl(''),
  });
  constructor(private wareventoryUC: WareVentoryUseCase,private messageService:MessageService,private translateService:TranslateService) { 
    this.translateService.use(sessionStorage.getItem('language'));
    this.getShippingList();
   
  }
  
  
  getShippingList(){
    this.wareventoryUC.getPicking("").subscribe(
      data => {
        console.log(data);
        this.pickingList = data.sort((a, b) => a.code.localeCompare(b.code));
        this.filteredPickingList = this.pickingList;
      },
      error => {
        console.log(error);
      }
    );
  }
  deleteList(code: any,event:Event){
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this Picking list: " + code + "?")) {
      let param={"code":code,"operation":"delete"}
    
      this.wareventoryUC.postShipping(param).subscribe(
        data => {
          console.log(data);
          this.getShippingList();
          this.toastMessage('success', 'Picking list deleted', 'Picking list deleted successfully');
        },
        error => {
          console.log(error);
          this.toastMessage('error', 'Error', 'Error deleting Picking list');
        }
      );
    }
  }

  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary:summary, detail:detail});
  }

  showDialog(){
    this.displayDialog = true;
  }
  hideDialog(){
    this.displayDialog = false;
  }
  showNewObjetcDialog(){
    this.displayObjectDialog = true;
  }
  hideNewObjectDialog(){
    this.displayObjectDialog = false;
  }
  showJSONDialog(){
    this.displayJSONdialog = true;
  }
  hideJSONDialog(){
    this.displayJSONdialog = false;
  }
  addPickingList(){
      if(this.newPickingListCode=='' || this.pickingListItems.length==0 || this.newPickingListCode==null){
        this.toastMessage('error','Error','Tenga un codigo o al menos un item en la lista');
        return;
      }
      let param={"code":this.newPickingListCode,"items":this.pickingListItems}
      this.wareventoryUC.postNewShippingList(param).subscribe(
        data => {
          console.log(data);
          this.getShippingList();
          this.toastMessage('success', 'Picking list added', 'Picking list added successfully');
        },
        error => {
          console.log(error);
          this.toastMessage('error', 'Error', 'Error adding Picking list');
        }
      );

  }

  addItem(){
    if(this.newItemForm.getRawValue().SKU=='' || this.newItemForm.getRawValue().quantity==''){
      this.toastMessage('error','Error','Please fill all fields');
      return;
    }
    else if((this.newItemForm.getRawValue().quantity as any)<=0){
      this.toastMessage('error','Error','Quantity must be greater than 0');
      return;
    }
    else if(this.newItemForm.getRawValue().quantity===null){
      this.toastMessage('error','Error','Quantity must be a number');
      return;
    }

    this.pickingListItems.push(this.newItemForm.getRawValue());
    console.log("valor de pickingListItems: "+this.pickingListItems);
  }
  deleteRow(rowData: any) {
    this.pickingListItems = this.pickingListItems.filter(item => item !== rowData);
  }
  addPickingListByJson(){
    try{
      this.itemJSONlist=JSON.parse(this.itemJSONlist);
      if(!Array.isArray(this.itemJSONlist)){
        this.toastMessage('error','Error','JSON no válido');
        return;
      }
      if(this.itemJSONlist.length<1){
        this.toastMessage('error','Error','JSON no válido, longitud menor a 1');
        return;
      }
      for(let i=0;i<this.itemJSONlist.length;i++){
        if(this.itemJSONlist[i].SKU=='' || this.itemJSONlist[i].quantity==''){
          this.toastMessage('error','Error','Por favor llene todos los campos');
          return;
        }
        if(this.itemJSONlist[i].quantity<0 || isNaN(this.itemJSONlist[i].quantity)){
          this.toastMessage('error','Error','La cantidad no puede ser negativa o ser un caracter');
          return;
        }
      }
      this.pickingListItems=[];
      this.pickingListItems=this.itemJSONlist;
      this.itemJSONlist="";
      this.hideJSONDialog();
    }
    catch(e){
      this.toastMessage('error','Error','JSON no válido'+e);
      return;
    }
  }

  applyFilter(){
   
    if(this.filterText==''){
      this.getShippingList();
      return;
    }
    this.filteredPickingList=this.pickingList.filter((location)=>{
      return location.code.toLowerCase().includes(this.filterText.toLowerCase());
    });
  }
 

  
}
