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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
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
        TableModule,
        ToastModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateModule,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
        
    ],
    declarations: [PlacementComponent],
    providers: [MessageService]
})
export class PlacementModule { }
