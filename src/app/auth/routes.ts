import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RecipesByUserComponent } from "./recipes-by-user/recipes-by-user.component";



export const authRoutes: Routes = [
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent}
]

