import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
        { path: 'jobDetail/:jobId', loadChildren: () => import('./job-detail/job-detail.module').then(m => m.JobsDetailModule) },
        { path: 'location', loadChildren: () => import('./location/location.module').then(m => m.LocationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ContentRoutingModule { }
