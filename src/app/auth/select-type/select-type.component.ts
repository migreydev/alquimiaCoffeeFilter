import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-type',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select-type.component.html'
})
export class SelectTypeComponent implements OnInit{


  constructor(private recipeService : RecipeService){}

  ngOnInit(): void {
    
  }

  @Output() typeMethod = new EventEmitter<string>();

  method : string = '';

  

  onMethodChange(){
    this.typeMethod.emit(this.method);
  }

}
