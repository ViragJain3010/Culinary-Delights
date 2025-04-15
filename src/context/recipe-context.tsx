// // src/context/recipe-context.tsx
// "use client"

// import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
// import { getFeaturedRecipes, getAllRecipes } from "@/lib/drupal"
// import { Recipe } from "@/types/types"

// // Create the context with a default value
// const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

// // Provider component
// export function RecipeProvider({ children }: { children: ReactNode }) {
//   const [recipes, setRecipes] = useState<Recipe[]>([])
//   const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // Fetch all recipes on initial load
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true)
//         const [allRecipes, featured] = await Promise.all([getAllRecipes(), getFeaturedRecipes()])

//         setRecipes(allRecipes)
//         setFeaturedRecipes(featured)
//         setError(null)
//       } catch (err) {
//         console.error("Error fetching recipes:", err)
//         setError("Failed to load recipes. Please try again later.")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Function to get a single recipe by ID
//   const getRecipe = (id: string) => {
//     return recipes.find((recipe) => recipe.id === id)
//   }

//   // Value object that will be passed to consumers
//   const value = {
//     recipes,
//     featuredRecipes,
//     isLoading,
//     error,
//     getRecipe,
//   }

//   return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
// }

// // Custom hook for using the recipe context
// export function useRecipes() {
//   const context = useContext(RecipeContext)
//   if (context === undefined) {
//     throw new Error("useRecipes must be used within a RecipeProvider")
//   }
//   return context
// }

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Recipe, PaginationState, RecipeContextType } from "@/types/types"
import { drupalService } from "@/services/DrupalService"

// Create the context with a default value
const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

// Provider component
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
    totalItems: 0
  })

  // Fetch recipes when page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [{ recipes: allRecipes, pagination: paginationData }, featured] = await Promise.all([
          drupalService.getAllRecipes(pagination.currentPage, pagination.pageSize),
          drupalService.getFeaturedRecipes()
        ])

        setRecipes(allRecipes)
        setFeaturedRecipes(featured)
        setPagination(paginationData)
        setError(null)
      } catch (err) {
        console.error("Error fetching recipes:", err)
        setError("Failed to load recipes. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [pagination.currentPage, pagination.pageSize])

  // Function to set current page
  const setCurrentPage = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }))
  }

  // Function to get a single recipe by ID
  const getRecipe = (id: string) => {
    return recipes.find((recipe) => recipe.id === id)
  }

  // Function to search and filter recipes
  // const searchRecipes = ({ category = "", search = "" }: { category?: string; search?: string }) => {
  //   return recipes.filter((recipe) => {
  //     const matchesCategory = category ? recipe.category.toLowerCase() === category.toLowerCase() : true
  //     const matchesSearch = search
  //       ? recipe.title.toLowerCase().includes(search.toLowerCase()) ||
  //         recipe.description.toLowerCase().includes(search.toLowerCase())
  //       : true
  //     return matchesCategory && matchesSearch
  //   })
  // }

  // Value object that will be passed to consumers
  const value: RecipeContextType = {
    recipes,
    featuredRecipes,
    isLoading,
    error,
    getRecipe,
    pagination,
    setCurrentPage,
    // searchRecipes
  }

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

// Custom hook for using the recipe context
export function useRecipes() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider")
  }
  return context
}