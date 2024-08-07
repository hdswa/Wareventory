import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionRoutingModule } from './action-routing.module';
@NgModule({
    
    imports: [
        CommonModule,
        ActionRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class ActionModule { }
