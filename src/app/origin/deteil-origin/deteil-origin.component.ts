import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FormsModule } from '@angular/forms';
import { OriginService } from '../services/origin.service';
import { Origin } from '../interfaces/origin';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-deteil-origin',
    standalone: true,
    templateUrl: './deteil-origin.component.html',
    imports: [FooterComponent, NavBarComponent, FormsModule, RouterLink]
})
export class DeteilOriginComponent implements OnInit{

  constructor( private originService : OriginService,
                private route : ActivatedRoute
  ){}


  ngOnInit(): void {
    this.getOrigin();
  }

  origin : Origin  = {
    id : 0,
    country: '',
    region: '',
    notesFlavour: '',
  }

  getOrigin(){
    this.route.params.subscribe(params => {
      const id = +params['id']; //convierte el id de la ruta en un numero
      if (id) { 

        this.originService.getOriginById(id).subscribe({
          next: origin =>{
            this.origin = origin;
          },
          error : error =>{
            console.error('Error', error);
          }
        })
      }
    })
  }

}
