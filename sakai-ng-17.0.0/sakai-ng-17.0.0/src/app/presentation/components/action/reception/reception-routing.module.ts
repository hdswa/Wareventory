import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReceptionComponent } from './reception.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReceptionComponent }
    ])],
    exports: [RouterModule]
})
export class ReceptionRoutingModule { }
