import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { DeleteJobComponent } from './delete-job.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DeleteJobComponent }
    ])],
    exports: [RouterModule]
})
export class DeleteJobRoutingModule { }
