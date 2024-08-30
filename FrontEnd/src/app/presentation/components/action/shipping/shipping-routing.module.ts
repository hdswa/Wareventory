import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShippingComponent } from './shipping.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ShippingComponent }
    ])],
    exports: [RouterModule]
})
export class ShippingRoutingModule { }
