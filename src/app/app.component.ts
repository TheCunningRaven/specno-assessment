import { Component } from '@angular/core';
import { OutletContext,RouterOutlet } from '@angular/router';
import { slider } from './route-transition-animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider
  ]
})
export class AppComponent {
  title = 'specno';
  prepareRouteOutlet(outlet: RouterOutlet){
    return outlet && 
    outlet.activatedRouteData && 
    outlet.activatedRouteData['animation'];
  }
}
