import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    imports: [FooterComponent, NavBarComponent],
    styleUrl: './home.component.css'
})
export class HomeComponent {

}
