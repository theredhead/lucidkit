import { Component } from '@angular/core';
import { UIQRCode } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-wifi-qr',
  standalone: true,
  imports: [UIQRCode],
  template: '<ui-qr-code [value]="wifiString" [size]="200"></ui-qr-code>',
})
export class WifiQrComponent {
  // Format: WIFI:T:<auth>;S:<ssid>;P:<password>;;
  // auth: WPA, WEP, or nopass
  public readonly wifiString = 'WIFI:T:WPA;S:GuestNetwork;P:welcome123;;';
}
