import { Component, ErrorHandler, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfigService, AuthenticationService, ISessionState, ImxTranslationProviderService, SplashService } from 'qbm';
import { MatDialog } from '@angular/material/dialog';
import { QerApiService, SettingsComponent } from 'qer';
import { EuiLoadingService, EuiTheme, EuiThemeService } from '@elemental-ui/core';
import { ProfileSettings } from 'imx-api-qer';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'imx-change-passwd',
  templateUrl: './change-passwd.component.html',
  styleUrls: ['./change-passwd.component.scss']
})
export class ChangePasswdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
