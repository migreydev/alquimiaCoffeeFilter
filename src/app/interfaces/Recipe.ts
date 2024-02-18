
export interface Recipe {
    id: number,
    userId: number,
    userName: string,
    userEmail: string,
    title: string,
    description: string,
    filteringMethod: string,
    originIds: number[],
    image: string,
    deleted: number
}