import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reception', loadChildren: () => import('./reception/reception.module').then(m => m.ReceptionModule) },
        { path: 'placement', loadChildren: () => import('./placement/placement.module').then(m => m.PlacementModule) },
        { path: 'transfer', loadChildren: () => import('./transfer/transfer.module').then(m => m.TransferModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ActionRoutingModule { }
