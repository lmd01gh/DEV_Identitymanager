import { Component, OnInit,ViewChild, CUSTOM_ELEMENTS_SCHEMA,  Inject } from '@angular/core';
import {  SplashService } from 'qbm';
import { CaptchaService, ColumnDependentReference,AppConfigService, ConfirmationService, SnackBarService, CdrFactoryService } from 'qbm';

import {  UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import {FormBuilder, Validators} from '@angular/forms';

import { QerApiService } from "qer";
import { V2Client} from 'imx-api-ccc';

import { Router , RouterLink} from '@angular/router';
import { MatStepper } from '@angular/material/stepper';






@Component({
  selector: 'imx-cccpasswdchange',
  styleUrls: ['./cccpasswdchange.component.scss'],
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {
  
  public readonly profileForm: UntypedFormGroup;
  public readonly formGroup: UntypedFormGroup;
  public  _v2Client: V2Client;
  @ViewChild('stepper') public stepper: MatStepper;
  
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
  Pin="";
 
  
  userName="";
  resCodigo=true;
  errorSolicitud=false;
  alertPin=false;
  respuesta: string;
  ruta: string;
  

  
  


  constructor(
   // private readonly sidesheetRef: EuiSidesheetRef,
    private _formBuilder: FormBuilder,
    private readonly splash: SplashService,
    public readonly captchaSvc: CaptchaService,
    private readonly qerApiService: QerApiService,
    private readonly config: AppConfigService,
    private readonly router: Router,
 
    
  
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
   const schemaProvider = this.config.client;
   this._v2Client = new V2Client(this.config.apiClient,schemaProvider);
  this.splash.close()
  
  }
  

private setup(): void {
}

public async EnviarPin() {
  console.log("entro en opcion Seleccionada");
  
  console.log(this.Login);
  console.log(this.Pin);
  //this.respuesta = this.v2Client.Customeprinsa_CCC_SolicitudOTP_get();
  
 //let respuesta2= await this._v2Client.Customeprinsa_CCC_SolicitudOTP_get({OTP_Usuario:"lmd01",OTP_EnviarA:"lala"})
 let respuesta2= await this._v2Client.Customeprinsa_CCC_SolicitudOTP_get({OTP_Usuario:this.Login ,OTP_EnviarA:this.Pin})
  //return "1"
  console.log(respuesta2);
  if (respuesta2 == "-1") 
  {
    this.errorSolicitud=true;
    this.alertPin=false;
  }
  else{
    this.errorSolicitud=false;
    this.alertPin=true;
  }
//  console.log ("la respuesta es: " + this.respuesta)
//console.log ("despues de llamar al método ")

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

public LimpiarVariables():void
{
  this.resCodigo = true;
  this.errorSolicitud=false;
  this.alertPin=false;
}
public onCodigoDismissed(): void {
  this.resCodigo = true;
  this.errorSolicitud=false;
  this.alertPin=false;
  //console.log("limpio variables de control");

}

public onCodigoCorrecto():void {
  this.LimpiarVariables();
  this.Login="";
  this.Pin="";
  this.stepper.reset();
}

}

