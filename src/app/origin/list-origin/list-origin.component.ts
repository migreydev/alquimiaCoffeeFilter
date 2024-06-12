import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { OriginService } from '../services/origin.service';
import { Origin } from '../interfaces/origin';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-list-origin',
    standalone: true,
    templateUrl: './list-origin.component.html',
    imports: [FooterComponent, NavBarComponent, RouterLink],
    styleUrl: './list-origin.component.css'
})
export class ListOriginComponent implements OnInit{

  constructor(private originService : OriginService){}

  ngOnInit(): void {
    this.getAllOrigins();
    this.getTotalOrigins();
  }

  origins : Origin[] = [];
  totalOrigins: number = 0;

  getAllOrigins(){
    this.originService.getOrigins().subscribe({
      next: origins =>{
        this.origins = origins;
      },
      error: error =>{
        console.error('Error al obtener los origies', error);
      }
    })
  }

  getTotalOrigins(){
    return this.origins.length;
  }

  deleteOrigin(id: number){
    this.originService.deleteOrigin(id).subscribe({
      next: () =>{
        this.getAllOrigins();
        console.log('Origin deleted');
      },
      error: error =>{
        console.error('Error', error);
      }
    })
  }

}
