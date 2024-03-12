import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA,  Inject } from '@angular/core';
import { EuiLoadingService,  EuiSidesheetService  } from '@elemental-ui/core';
import { IdentitySidesheetComponent } from 'qer';
import {  SplashService } from 'qbm';
import { CaptchaService, ColumnDependentReference, ConfirmationService, SnackBarService, CdrFactoryService } from 'qbm';
import { IdentitiesService } from 'qer';
import { PortalPersonReports, QerProjectConfig } from 'imx-api-qer';
import {  UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EuiSidesheetRef, EUI_SIDESHEET_DATA } from '@elemental-ui/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { QerApiService } from "qer";
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { MatRadioChange } from '@angular/material/radio';




@Component({
  selector: 'imx-cccpasswdchange',
  styleUrls: ['./cccpasswdchange.component.scss'],
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {
  
  public readonly profileForm: UntypedFormGroup;
  public readonly formGroup: UntypedFormGroup;
  
  public cdrList: ColumnDependentReference[] = [];
  public accountIsOff = 0;
  public subscriptions: Subscription[] = [];
 
 

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  
  IsSelected = "true";
  PinTemporalSi = "true";
  PinTemporalNo ="false";
  editable="false";
  
  PinTemporal: string;
  ConPinTemporal=false;
  Login="";
 
  
  userName="";
  resCodigo=true;


  constructor(
   // private readonly sidesheetRef: EuiSidesheetRef,
    private _formBuilder: FormBuilder,
    private readonly splash: SplashService,
    public readonly captchaSvc: CaptchaService,
    private readonly qerApiService: QerApiService,
    
    
    )
    {
     // this.profileForm = new UntypedFormGroup({ formArray: formBuilder.array([]) });
      //  this.setup();
      this.formGroup = new UntypedFormGroup({
        answer: new UntypedFormControl('', { updateOn: 'blur', validators: [Validators.required] }),
        
      });
      
    }
    
 

  ngOnInit(): void {
   // console.log("llego")
    this.splash.close()
  
  }
  

private setup(): void {
}

EnviarPin() : void{
  console.log("entro en opcion Seleccionada")

}



  async CompruebaCaptcha(noResetMessage?: boolean): Promise<void> {
    try {
    this.resCodigo=true;
    const resp = this.captchaSvc.Response;
    this.captchaSvc.Response = "";

    // use this API call to set the CAPTCHA on the server side
    await this.qerApiService.client.passwordreset_passwordquestions_account_post({
      AccountName: this.userName,
      Code: resp
    });
  //  console.log ("respuesta " + resp)
    this.captchaSvc.Response=resp;
    this.resCodigo=true;
  } catch (e) {
    this.resCodigo=false;
    this.captchaSvc.ReinitCaptcha();
    //console.log ("respuesta incorrecta " + e)
    throw e;
  }finally {
    
  }
  

}

ModificaOpcionSeleccionada() : void{
  //console.log (this.ConPinTemporal);

}
public onCodigoDismissed(): void {
  this.resCodigo = true;
}

}

