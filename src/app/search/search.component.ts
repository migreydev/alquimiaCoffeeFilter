import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  
  @Output() searchEvent: EventEmitter<string> = new EventEmitter(); // Evento de salida que emite la barra de busqueda.
  searchTerm: string = '';

  constructor(){}
  
  ngOnInit(): void {

    
  }
// Metodo para activar la busqueda y emitir el termino de busqueda.
  search(): void {
    this.searchEvent.emit(this.searchTerm.trim().toLowerCase());// Emite el termino de busqueda y converte a minusculas.
  }
}
