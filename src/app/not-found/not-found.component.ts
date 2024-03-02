import { Component } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'app-not-found',
    standalone: true,
    templateUrl: './not-found.component.html',
    imports: [NavBarComponent, FooterComponent],
    styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
