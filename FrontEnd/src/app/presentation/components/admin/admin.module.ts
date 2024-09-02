import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
@NgModule({
    
    imports: [
        CommonModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class AdminModule { }
