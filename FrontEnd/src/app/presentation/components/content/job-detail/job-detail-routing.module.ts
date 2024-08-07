import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobDetailComponent } from './job-detail.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: JobDetailComponent }
    ])],
    exports: [RouterModule]
})
export class JobsDetailRoutingModule { }
