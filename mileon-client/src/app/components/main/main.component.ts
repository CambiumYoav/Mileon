import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { SharedComponents } from '../../shared/shared-modules';
import { SharedImports } from '../../shared/shared-modules';
import { RouterOutlet } from '@angular/router';
import { MainMenuComponent } from "../shared/base/menu/main-menu/main-menu.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [...SharedImports, ...SharedComponents, RouterOutlet, MainMenuComponent],
})
export class MainComponent implements OnInit {
  constructor(private baseService: BaseService) {
    this.baseService.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `bearer ${sessionStorage['token']}`,
      }),
    };
  }
  ngOnInit(): void {}
}
