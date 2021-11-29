import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-office-view',
  templateUrl: './office-view.component.html',
  styleUrls: ['./office-view.component.scss']
})
export class OfficeViewComponent implements OnInit {

  office:any = {}

  constructor(
    private service: SharedService
    ) { }

  ngOnInit(): void {
    this.office = this.service.getCurrentOffice();
  }


}
