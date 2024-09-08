import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NewJobComponent } from './new-job.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NewJobComponent }
    ])],
    exports: [RouterModule]
})
export class NewJobRoutingModule { }
