import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([

       { path:'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
       { path:'delete-user', loadChildren: () => import('./delete-user/delete-user.module').then(m => m.DeleteUserModule) },
       { path:'delete-job', loadChildren: () => import('./delete-job/delete-job.module').then(m => m.DeleteJobModule) },
       { path:'new-job', loadChildren: () => import('./new-job/new-job.module').then(m => m.NewJobModule) },
       { path:'admin-shipping-list', loadChildren: () => import('./admin-shipping-list/admin-shipping-list.module').then(m => m.AdminShippingListModule) },
       { path:'admin-location', loadChildren: () => import('./admin-location/admin-location.module').then(m => m.AdminLocationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
    