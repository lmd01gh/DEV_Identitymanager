import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA,  Inject } from '@angular/core';
import { EuiLoadingService,  EuiSidesheetService  } from '@elemental-ui/core';
import { IdentitySidesheetComponent } from 'qer';
import {  SplashService } from 'qbm';
import { CaptchaService, ColumnDependentReference, ConfirmationService, SnackBarService, CdrFactoryService } from 'qbm';
import { IdentitiesService } from 'qer';
import { PortalPersonReports, QerProjectConfig } from 'imx-api-qer';
import {  UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EuiSidesheetRef, EUI_SIDESHEET_DATA } from '@elemental-ui/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormGroup } from '@angular/forms';




@Component({
  selector: 'imx-cccpasswdchange',
  styleUrls: ['./cccpasswdchange.component.scss'],
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {
  
  public readonly profileForm: UntypedFormGroup;
  
  public cdrList: ColumnDependentReference[] = [];
  public accountIsOff = 0;
  public subscriptions: Subscription[] = [];
 

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
    thirdCtrl: ['', Validators.required],
    fourCtrl: ['', Validators.required],
  });

  
  IsSelected = "true";
  PinTemporalSi = "true";
  PinTemporalNo ="false";
  
  PinTemporal: string;
  ConPinTemporal=true;
  
  public type: 'new' | 'existing' = 'new';
  
  radioOptions: FormGroup;
  withSubordinates= true;


  constructor(
   // private readonly sidesheetRef: EuiSidesheetRef,
    private _formBuilder: FormBuilder,
    private readonly splash: SplashService,
    private readonly cdrFactoryService: CdrFactoryService,
    
    private readonly sidesheetService: EuiSidesheetService,
    private readonly identityService: IdentitiesService,  
    public readonly captchaSvc: CaptchaService,
    
    
    )
    {
     // this.profileForm = new UntypedFormGroup({ formArray: formBuilder.array([]) });
      //  this.setup();
      
    }
    
 

  ngOnInit(): void {
   // console.log("llego")
    this.splash.close()
  
  }
  

private setup(): void {
}


  
  }

