import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PickingComponent } from './picking.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PickingComponent }
    ])],
    exports: [RouterModule]
})
export class PickingRoutingModule { }