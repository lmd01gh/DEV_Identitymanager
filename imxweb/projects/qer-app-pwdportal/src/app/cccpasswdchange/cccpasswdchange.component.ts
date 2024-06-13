import { Component, OnInit,ViewChild, CUSTOM_ELEMENTS_SCHEMA,  Inject } from '@angular/core';
import {  SplashService, SystemInfoService } from 'qbm';
import { CaptchaService, ColumnDependentReference,AppConfigService } from 'qbm';

import {  UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import {FormBuilder, Validators} from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';

import { V2Client} from 'imx-api-ccc';
import { MatStepper } from '@angular/material/stepper';
import {cccvisorpaswdComponent} from "./cccvisorpaswd.component";

import {  AuthenticationService, imx_SessionService, UserMessageService } from 'qbm';
import { EuiLoadingService } from "@elemental-ui/core";
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'imx-cccpasswdchange',
  styleUrls: ['./cccpasswdchange.component.scss'],
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {
  
  public readonly profileForm: UntypedFormGroup;
  public readonly formGroup: UntypedFormGroup;
  public  _v3Client: V2Client;
  public showPageContent = true;
  public isLoggedIn = false;
  
  
   @ViewChild('stepper') public stepper: MatStepper;
  

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  ThirdFormGroup = this._formBuilder.group({
    ThirdFormCtrl: ['', Validators.required],
    FourFormCtrl: ['', Validators.required],
  });
 
  
  IsSelected = "true";
  PinTemporalSi = "true";
  PinTemporalNo ="false";
  editable="false";
  
  PinTemporal: string;
  ConPinTemporal=false;
  Login="";
  Pin="";
  PinAcceso="";
  NuevaPasswd="";
  RepetirPasswd="";
  tercerPaso=false;
 
  
  userName="";
  
  resCodigo=true;
  errorSolicitud=false;
  alertPin=false;
  respuesta: string;
  ruta: string;
  errorPascode=false;
  
  
  

  
  


  constructor(
    private _formBuilder: FormBuilder,
    private readonly splash: SplashService,
    public readonly captchaSvc: CaptchaService,
    private readonly config: AppConfigService,
		private readonly session: imx_SessionService,
		private readonly busyService: EuiLoadingService,
		private readonly messageSvc: UserMessageService, 
    private dialogService: MatDialog,
    )

    {
      
      this.formGroup = new UntypedFormGroup({
        answer: new UntypedFormControl('', { updateOn: 'blur', validators: [Validators.required] }),  
      });     
  
    }
    
 
    
  ngOnInit(): void {
   
  const schemaProvider = this.config.client;
  this._v3Client = new V2Client(this.config.apiClient,schemaProvider);
  
  this.splash.close();
  
  }
 


private setup(): void {
}

public async EnviarPin() {
  //console.log("entro en opcion Seleccionada");
  
  console.log(this.Login);
  console.log(this.Pin);
  
  
 let respuesta2= await this._v3Client.Customeprinsa_CCC_SolicitudOTP_get({OTP_Usuario:this.Login ,OTP_EnviarA:this.Pin})
 
 
 
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


}




  
    async VerificarAcceso()
    {
      this.resCodigo=true;
      
      const resp = this.captchaSvc.Response;
      var resp1= await this._v3Client.Customeprinsa_CCC_CompruebaCaptcha_get({Codigo:resp})
      console.log ("respuesta del captcha " + resp1);
      if (resp1 == "0" )
      {
        //captcha incorrecto
        this.captchaSvc.ReinitCaptcha();  
        this.errorPascode=true;
        this.tercerPaso=false;
        this.stepper.previous();
      }

      else{
   
        //si nos devuelve un 1 el captcha es correcto
      this.messageSvc.subject.next(undefined);
      let overlayRef: OverlayRef;
      setTimeout(() => overlayRef = this.busyService.show());
      try {
          const newSession = await this.session.login({
              __Product: "PasswordReset",
              Module: "Passcode",
              User: this.Login,
              Passcode: this.PinAcceso
          });
          if (newSession) {
            setTimeout(() => this.busyService.hide(overlayRef));
            this.errorPascode=false;
            this.tercerPaso=true;
            
             //console.log(newSession.IsLoggedIn);
            //console.log(newSession.UserUid);
            //console.log(newSession.Username);
            //console.log(newSession);    
            //console.log(this.PinAcceso);
            //console.log(this.Login);
           //Tengo que mostrar datos para cambio de contraseña
            console.log("Error PassCode " + this.errorPascode);
            console.log("Tercer Paso  " + this.tercerPaso);
           //this.stepper.next();
           
            
           
          }
          else {
            console.log("tercer paso en else " + this.tercerPaso);
            this.errorPascode=true;
            this.tercerPaso=false;
            this.stepper.previous();
            setTimeout(() => this.busyService.hide(overlayRef));
          }
        }catch {
          setTimeout(() => this.busyService.hide(overlayRef));
          this.errorPascode=true;
          this.tercerPaso=false;
          this.stepper.previous();          
          console.log("Error pascode" + this.errorPascode)

        }        
        
      }
    }
    
    Reset() {
      this.resCodigo = false;
    }
    

    async CambiarPasswd()
    {
      if (this.NuevaPasswd != this.RepetirPasswd)
        {
          console.log ("Error. Password distintas");
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
  this.errorPascode=false;
  this.tercerPaso=false;
  
}
public onCodigoErrorDismissed(): void {
  this.resCodigo = true;
  //ErrorSolicitud Se usa para comprobar que cuando solicite un pin me haya generado uno y me lo haya enviado correctamente
  this.errorSolicitud=false;
  //alertPin se usa para mostrar mensaje de error
  this.alertPin=false;
  //errorPascode se usa para mostrar error en el caso de que el pascode introducido sea incorrecto
  this.errorPascode=false;
  //tercerPaso. Se usa para pasar o no a la tercera pestaña del stepper
  this.tercerPaso=false;
  
  //console.log("limpio variables de control");

}

public onCodigoCorrectoDismissed():void {
  this.LimpiarVariables();
  this.Login="";
  this.Pin="";
  this.stepper.reset();
}

public ReinciciarCaptcha():void{
this.captchaSvc.ReinitCaptcha();
}



async  RequisitosPasswd()
{
  const resp3=await this._v3Client.Customeprinsa_PoliticaPassword_columnas_get({})  
  this.dialogService.open(cccvisorpaswdComponent, {
        data: {Title: resp3.Entities[0].Columns.DisplayName.Value,
        HistoryLen: resp3.Entities[0].Columns.HistoryLen.Value,
        MaxLen: resp3.Entities[0].Columns.MaxLen.Value,
        MinLen: resp3.Entities[0].Columns.MinLen.Value,
        SpecialCharsDenied: resp3.Entities[0].Columns.SpecialCharsDenied.Value
        },
        panelClass: 'imx-messageDialog',
        disableClose: true
    });
  
  }

 
}

