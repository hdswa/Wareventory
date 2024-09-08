import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminLocationComponent } from './admin-location.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AdminLocationComponent }
    ])],
    exports: [RouterModule]
})
export class AdminLocationRoutingModule { }
