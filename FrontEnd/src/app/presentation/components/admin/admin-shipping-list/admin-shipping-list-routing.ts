import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminShippingListComponent } from './admin-shipping-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AdminShippingListComponent }
    ])],
    exports: [RouterModule]
})
export class AdminShippingListRoutingModule { }
