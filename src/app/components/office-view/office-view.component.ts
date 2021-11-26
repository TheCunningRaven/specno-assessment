import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IOffice } from 'src/app/interfaces/offices';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-office-view',
  templateUrl: './office-view.component.html',
  styleUrls: ['./office-view.component.scss']
})
export class OfficeViewComponent implements OnInit {

  office:any = {}

  constructor(
    private modalService: BsModalService,
    private service: SharedService
    ) { }

  ngOnInit(): void {
    this.office = this.service.getCurrentOffice();
  }


}
