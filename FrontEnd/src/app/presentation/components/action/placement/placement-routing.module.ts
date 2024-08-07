import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlacementComponent } from './placement.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PlacementComponent }
    ])],
    exports: [RouterModule]
})
export class PlacementRoutingModule {



    
 }
