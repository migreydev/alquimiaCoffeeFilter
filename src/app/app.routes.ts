import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListaRecetasComponent } from './lista-recetas/lista-recetas.component';
import { AddRecetaComponent } from './add-receta/add-receta.component';
import { EditRecetaComponent } from './edit-receta/edit-receta.component';
import { DetailRecetaComponent } from './deteil-receta/deteil-receta.component';
import { RecipesByUserComponent } from './auth/recipes-by-user/recipes-by-user.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'recipes', component: ListaRecetasComponent },
    { path: 'recipe', component: AddRecetaComponent },
    { path: 'recipe/:id', component: EditRecetaComponent },
    { path: 'recipe/detail/:id', component: DetailRecetaComponent },
    { path: 'user/:userId/recipes', component: RecipesByUserComponent },
    { path: 'auth', loadChildren: () => import('./auth/routes').then(mod => mod.authRoutes) },
];
