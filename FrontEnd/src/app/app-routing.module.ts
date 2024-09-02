import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/shared/app.layout.component";
import { AuthGuard } from './presentation/components/auth/authGuard/auth.guard';
import { AdminAuthGuard } from './presentation/components/auth/authGuard/admin.guard';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./presentation/components/dashboard/dashboard.module').then(m => m.DashboardModule)},
                 
                    { path: 'content', loadChildren: () => import('./presentation/components/content/content.module').then(m => m.ContentModule),canActivate: [AuthGuard] },
                    { path: 'action', loadChildren: () => import('./presentation/components/action/action.module').then(m => m.ActionModule), canActivate: [AuthGuard]},
                    { path: 'admin', loadChildren: () => import('./presentation/components/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminAuthGuard] },
                ]
                
            },
            { path: 'auth', loadChildren: () => import('./presentation/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
