import { Component, OnInit} from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { TranslateService } from '@ngx-translate/core';


const TRANSLATIONS=[
  'TEXT.SKU',
  'TEXT.LOCATION',
  'TEXT.QUANTITY',
]
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',

})
export class LocationComponent implements OnInit{

  constructor(private wareventoryUC:WareVentoryUseCase,private messageService:MessageService,private translateService:TranslateService){
    this.translateService.use(sessionStorage.getItem('language'));
  }

  async ngOnInit(): Promise<void> {
    await this.initTranslations();
    this.initCols();
  }
  public gotData: boolean = false;
  public translations:{[key:string]:string}={};
  public cols: any[] = [];
  initCols(){
    this.cols=[
      {field:'SKU',header:this.translations['TEXT.SKU']},
      {field:'location',header:this.translations['TEXT.LOCATION']},
      {field:'quantity',header:this.translations['TEXT.QUANTITY']},
    ]
  }
  public dataArray: any[] = [];
  public locationFormGroup=new FormGroup({
    itemSKU: new FormControl(''),
    location: new FormControl(''),
  });

  initTranslations():Promise<void>{
    return new Promise((resolve,reject)=>{
        
        this.translateService.get(TRANSLATIONS).subscribe(translations => {
            this.translations = translations;
            resolve();
        },
        error=>{
            reject(error);
        });
    });
  }

  public searchBySKU(){
    var skuParam={'itemSKU':this.locationFormGroup.get('itemSKU').value}
    this.wareventoryUC.getSKUlocations(this.locationFormGroup.value).subscribe(
      (data) => {
          // console.log(data)
          this.dataArray = data;
          this.gotData = true;
      },
      (error) => {
          console.log(error);
      }
    );
    


  }
  public SearchByLocation(){
    var locationParam={'location':this.locationFormGroup.get('location').value}
    console.log(this.locationFormGroup.get('location').value)
    this.wareventoryUC.getLocationItems(locationParam).subscribe(
      (data) => {
          // console.log(data)
          this.dataArray = data;
          this.gotData = true;
          this.toastMessage('success', 'Success', 'Data retrieved successfully');
      },
      (error) => {
          console.log(error);
      }
    );

  
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
