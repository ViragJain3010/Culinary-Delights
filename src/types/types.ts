// This file contains the types used in the application
// src/types/types.ts
export type Recipe = {
    id: string
    title: string
    summary: string
    image: string
    cookingTime: number
    difficulty: string
    ingredients: string[]
    instructions: string[]
    category: string
    featured: boolean  
    path: string       
}

export type RecipeContextType = {
  recipes: Recipe[]
  featuredRecipes: Recipe[]
  isLoading: boolean
  error: string | null
  getRecipe: (id: string) => Recipe | undefined
  pagination: PaginationState
  setCurrentPage: (page: number) => void
  // searchRecipes: (params: { category?: string; search?: string }) => Recipe[]
}

export type PaginationState = {
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number
  }