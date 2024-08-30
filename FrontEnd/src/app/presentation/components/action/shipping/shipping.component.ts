import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';


@Component({
  selector: 'app-transfer',
  templateUrl: './shipping.component.html',
})


export class ShippingComponent {

 
  constructor(private wareventoryUC:WareVentoryUseCase){
  }

  
}
