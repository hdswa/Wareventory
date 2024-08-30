import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reception', loadChildren: () => import('./reception/reception.module').then(m => m.ReceptionModule) },
        { path: 'placement', loadChildren: () => import('./placement/placement.module').then(m => m.PlacementModule) },
        { path: 'transfer', loadChildren: () => import('./transfer/transfer.module').then(m => m.TransferModule) },
        { path: 'shipping', loadChildren: () => import('./shipping/shipping.module').then(m => m.ShippingModule) },
        { path: 'picking', loadChildren: () => import('./picking/picking.module').then(m => m.PickingModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ActionRoutingModule { }
    