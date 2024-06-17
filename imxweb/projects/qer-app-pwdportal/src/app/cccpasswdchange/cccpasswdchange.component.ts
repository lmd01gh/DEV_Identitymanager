import { Component, OnInit,ViewChild, CUSTOM_ELEMENTS_SCHEMA,  Inject } from '@angular/core';
import {  SplashService  } from 'qbm';
import { CaptchaService, AppConfigService } from 'qbm';

import {  UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import {FormBuilder, Validators} from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';

import { V2Client} from 'imx-api-ccc';
import { MatStepper } from '@angular/material/stepper';
import {cccvisorpaswdComponent} from "./cccvisorpaswd.component";
import {cccvisorpasswdokComponent} from "./cccvisorpasswd-ok.component";

import {  imx_SessionService, UserMessageService } from 'qbm';
import { EuiLoadingService } from "@elemental-ui/core";
import { MatDialog } from '@angular/material/dialog';
import { PolicyValidationResult } from 'imx-api-qer';

import { PasswordService } from '../../../../qer/src/lib/password/password.service';



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
 
  
  
  
  
  
  PinTemporal: string;
  ConPinTemporal=false;
  UIDPerson="";
  Login="";
  Pin="";
  PinAcceso="";
  NuevaPasswd="";
  RepetirPasswd="";
  tercerPaso=false;
 

  
  //Se utiliza para la comprobación del captcha
  resCodigo=true;

  public errorSolicitud=false;
  alertPin=false;
  errorPascode=false;
  errorPasswd=false;
  errorCheckPasswd=false;
  
//PinTemporalSi = "true";
  //PinTemporalNo ="false";
  //ruta: string;
  //respuesta: string;
  //userName="";
  //editable="false";
  

  
  


  constructor(
    private _formBuilder: FormBuilder,
    private readonly splash: SplashService,
    public readonly captchaSvc: CaptchaService,
    private readonly config: AppConfigService,
		private readonly session: imx_SessionService,
		private readonly busyService: EuiLoadingService,
		private readonly messageSvc: UserMessageService, 
    private passwordSvc: PasswordService,
    private dialogService:MatDialog,

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
  
  //console.log(this.Login);
  //console.log(this.Pin);
  
  
 let respuesta2= await this._v3Client.Customeprinsa_CCC_SolicitudOTP_get({OTP_Usuario:this.Login ,OTP_EnviarA:this.Pin})
 
 
  //console.log(respuesta2);
  if (respuesta2 == "-1") 
  {
    this.errorSolicitud=true;
    //Error no me envia el pin por error en los datos. lamo a la pantalla modal para mostrar error
    this.dialogService.open(cccvisorpasswdokComponent, {
      data: {Login: "No se puede encontrar una combinación de cuenta y datos de recuperación aportados.",
         TipoError: 'EnvioDatos'
      },
      panelClass: 'imx-messageDialog',
      disableClose: true
  });

    this.alertPin=false;
  }
  else{
   
  //this.alertPin=true;
    this.onCodigoCorrectoDismissed();
    this.dialogService.open(cccvisorpasswdokComponent, {
      data: {Login: "En unos momentos recibirá un PIN para el reinicio de contraseña. Revise su cuenta o dispositivo.",
         TipoError: 'EnvioDatosOK'
      },
      panelClass: 'imx-messageDialog',
      disableClose: true
  });
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
            this.UIDPerson=newSession.UserUid;
            
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
      this.errorPasswd=false;
      this.errorCheckPasswd=false;
      if (this.NuevaPasswd != this.RepetirPasswd)
        {
          this.errorPasswd=true;
        }
      else{
        const resp4=await this._v3Client.Customeprinsa_PoliticaPassword_columnas_get({})  
        const Longitud=(resp4.Entities[0].Columns.MinLen.Value);
        if ((this.NuevaPasswd.length)< Longitud) 
          {
          this.errorCheckPasswd=true;
          }
        else{
          //Grabo la nueva password
            let overlayRef: OverlayRef;
            setTimeout(() => overlayRef = this.busyService.show());
        
            let results: PolicyValidationResult[];
            try {
              results = await this.passwordSvc.postOrCheckPassword({
                NewPassword: this.NuevaPasswd,
                CheckOnly: false,
                Ids: ["<Key><T>Person</T><P>" + this.UIDPerson + "</P></Key>.CentralPassword"]
              }, "");
            } finally {
              setTimeout(() => this.busyService.hide(overlayRef));
            }
        
            if (results.length === 0) 
              {
                //Todo correcto
              this.NuevaPasswd="";
              this.RepetirPasswd="";
              this.ThirdFormGroup.invalid;
              this.dialogService.open(cccvisorpasswdokComponent, {
                data: {Login: this.Login,
                  TipoError: 'CambioPasswd'
                },
                panelClass: 'imx-messageDialog',
                disableClose: true
            });
            
            this.stepper.reset();
              } 
            else {
              this.errorCheckPasswd=true;
            }
          }
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

public LimpiarErrorPaswd():void
{
  this.errorPasswd=false;  
  this.errorCheckPasswd=false;
}

public LimpiarErrorDatosRecuperacion():void
{
  this.errorSolicitud=false;
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
  //error.passwd. Se usa para mostrar el error si las contraseñas no coinciden.
}

public onCodigoCorrectoDismissed():void {
  this.LimpiarVariables();
  //this.Login="";
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

  onStepChange(event: any): void {
    //use event.selectedIndex to know which step your user in.
    console.log("Estoy en la pestaña " + event.selectedIndex);
    
}


}

