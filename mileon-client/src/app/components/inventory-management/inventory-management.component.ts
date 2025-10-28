import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss'],
  imports: [RouterModule]
})
export class InventoryManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
