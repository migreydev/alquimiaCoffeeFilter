import { Recipe } from "../../interfaces/Recipe";

export interface User {
    idUser: number,
    nombre: string,
    username: string,
    password: string,
    email: string,
    rol: string
    recipes: Recipe[];
}