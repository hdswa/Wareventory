import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PickingComponent } from './picking.component';
import { PickingRoutingModule } from './picking-routing.module';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DataModule } from 'src/app/features/data-module';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
@NgModule({
    imports: [
        CommonModule,
        PickingRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        DataModule,
        TableModule,
        DataViewModule
        
    ],
    declarations: [PickingComponent]
})
export class PickingModule { }
