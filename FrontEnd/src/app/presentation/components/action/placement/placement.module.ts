import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementComponent } from './placement.component';
import { PlacementRoutingModule } from './placement-routing.module';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DataModule } from 'src/app/features/data-module';
import { TableModule } from 'primeng/table';
@NgModule({
    imports: [
        CommonModule,
        PlacementRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        DataModule,
        TableModule
        
    ],
    declarations: [PlacementComponent]
})
export class PlacementModule { }
