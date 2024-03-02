import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListaRecetasComponent } from './lista-recetas/lista-recetas.component';
import { AddRecetaComponent } from './add-receta/add-receta.component';
import { EditRecetaComponent } from './edit-receta/edit-receta.component';
import { DetailRecetaComponent } from './deteil-receta/deteil-receta.component';
import { RecipesByUserComponent } from './auth/recipes-by-user/recipes-by-user.component';
import { authRoleGuard } from './guardians/auth-role.guard';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'recipes', component: ListaRecetasComponent },
    { path: 'recipe', component: AddRecetaComponent , canMatch: [authRoleGuard]},
    { path: 'recipe/:id', component: EditRecetaComponent , canMatch: [authRoleGuard]},
    { path: 'recipe/detail/:id', component: DetailRecetaComponent },
    { path: 'user/:userId/recipes', component: RecipesByUserComponent , canMatch: [authRoleGuard]},
    { path: 'auth', loadChildren: () => import('./auth/routes').then(mod => mod.authRoutes) },
    { path: 'recipesFavourite', component: FavoriteRecipesComponent  , canMatch: [authRoleGuard]},
    { path:"**", component:NotFoundComponent}
];
