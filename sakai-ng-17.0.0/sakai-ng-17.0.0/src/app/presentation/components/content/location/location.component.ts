import { Component } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',

})
export class LocationComponent {

  constructor(private wareventoryUC:WareVentoryUseCase){}
  public gotData: boolean = false;
  public cols=[
    {field:'SKU',header:'SKU'},
    {field:'location',header:'Location'},
    {field:'quantity',header:'Quantity'},
  ]
  public dataArray: any[] = [];
  public locationFormGroup=new FormGroup({
    itemSKU: new FormControl(''),
    location: new FormControl(''),
  });

  public searchBySKU(){
    var skuParam={'itemSKU':this.locationFormGroup.get('itemSKU').value}
    this.wareventoryUC.getSKUlocations(this.locationFormGroup.value).subscribe(
      (data) => {
          // console.log(data)
          this.dataArray = data;
          this.gotData = true;
      },
      (error) => {
          console.log(error);
      }
    );
    


  }
  public SearchByLocation(){
    var locationParam={'location':this.locationFormGroup.get('location').value}
    console.log(this.locationFormGroup.get('location').value)
    this.wareventoryUC.getLocationItems(locationParam).subscribe(
      (data) => {
          // console.log(data)
          this.dataArray = data;
          this.gotData = true;
      },
      (error) => {
          console.log(error);
      }
    );

  
  }
}
