import { Component } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-location',
  templateUrl: './admin-location.component.html',
})
export class AdminLocationComponent {

  public locationList: any[]= [];
  public filteredLocationList: any[]= [];
  public filterText: string = '';
  public itemDetail: any;

  public selectedCode: string = '';

  public displayLocationDetailDialog: boolean = false;

  constructor(private wareventoryUC: WareVentoryUseCase,private messageService:MessageService,private translateService:TranslateService) {
    this.translateService.use(sessionStorage.getItem('language'));
    this.getLocations();
  }


  getLocations(){
    let param={"onlyCode":true}
    this.wareventoryUC.getLocationItems(param).subscribe(
      data => {
        console.log(data);
        this.locationList = data.sort();
        this.filteredLocationList = this.locationList;
      },
      error => {
        console.log(error);
        this.toastMessage('error', 'Error', 'Error deleting Picking list');
      }
    );
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary:summary, detail:detail});
  }

  deleteLocation(code: any,event:Event){
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this Location: " + code + "?")) {
      let param={"code":code}
    
      this.wareventoryUC.deleteLocation(param).subscribe(
        data => {
          console.log(data);
          this.toastMessage('success', 'Location deleted', 'Location deleted successfully');
          this.getLocations();
        },
        error => {
          console.log(error);
          this.toastMessage('error', 'Error', 'Error deleting Location');
        }
      );
    }
  }


  locationDetail(code: any){
    console.log(code);
    this.getLocationDetailData(code);
    this.displayLocationDetailDialog = true;
    this.selectedCode = code;
  }

  hideLocationDetailDialog(){
    this.displayLocationDetailDialog=false;
  }

  getLocationDetailData(code: any){
    let param={"location":code}
    this.wareventoryUC.getLocationItems(param).subscribe(
      data => {
        data.forEach(item => {
          delete item.location;
        });
        this.itemDetail = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  applyFilter(){
   
    if(this.filterText==''){
      this.getLocations();
      return;
    }
    this.filteredLocationList=this.locationList.filter((location)=>{
      return location.toLowerCase().includes(this.filterText.toLowerCase());
    });
  }

  deleteLocationDetailItem(code: any,event:Event){
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item: " + code + "?")) {
      let param={"code":code}
      console.log(param)

    }
  }

  deleteRow(code: any){
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item: " + code + "?")) {
      this.itemDetail = this.itemDetail.filter((item)=>{
        return item.SKU != code;
      });
      this.updateLocationData();
    }
    

  }
  updateLocationData(){
    
    let param={"location":this.selectedCode,"items":this.itemDetail}
    console.log("valor de parametreo",param)
    
    this.wareventoryUC.putLocation(param).subscribe(
      data => {
        console.log(data);
        this.toastMessage('success', 'Location updated', 'Location updated successfully');
      },
      error => {
        console.log(error);
        this.toastMessage('error', 'Error', 'Error updating Location');
      }
    );
  }
}
