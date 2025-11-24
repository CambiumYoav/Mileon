import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  paymentData: string = "";
  constructor() { }

  ngOnInit(): void {
    let data = JSON.parse('{"' + decodeURI(location.search.substring(1).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
    let transfer = this.str2ab(JSON.stringify(data));
    this.paymentData = JSON.stringify(data);

    if (window && window.parent && window.parent !== window) {
      parent.postMessage(JSON.stringify(data), "*", [transfer])
    }
  }


  private str2ab(str: string): ArrayBuffer {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

}
