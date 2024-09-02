import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([

       { path:'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
       { path:'delete-user', loadChildren: () => import('./delete-user/delete-user.module').then(m => m.DeleteUserModule) },
       { path:'delete-job', loadChildren: () => import('./delete-job/delete-job.module').then(m => m.DeleteJobModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
    