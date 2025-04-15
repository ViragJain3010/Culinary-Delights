// src/app/recipes/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Heart, Printer, Share2, Star, Utensils, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRecipes } from "@/context/recipe-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Recipe } from "@/types/types"

export default function RecipeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoading, error, getRecipe } = useRecipes()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    if (!isLoading && params.id) {
      const foundRecipe = getRecipe(params.id as string)
      setRecipe(foundRecipe || null)

      // If recipe not found, we could redirect to 404 or show error
      if (!foundRecipe && !isLoading) {
        // Optional: router.push('/recipes')
      }
    }
  }, [isLoading, params.id, getRecipe])

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  // Show not found state
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <p className="text-muted-foreground mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/recipes">Browse Recipes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Main Content */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.cookingTime} mins</span>
            </div>
            <div className="flex items-center">
              <Utensils className="h-4 w-4 mr-1" />
              <span>{recipe.difficulty}</span>
            </div>
            {/* <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Serves {recipe.servings}</span>
            </div> */}
            {/* <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span>
                {recipe.rating} ({recipe.reviews} reviews)
              </span>
            </div> */}
          </div>

          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={recipe.image || "/placeholder.svg?height=400&width=800"}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </div>

          <Separator className="my-8" />

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <Separator className="my-8" />

          <div className="prose dark:prose-invert max-w-none">
            <h2>Instructions</h2>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>
                  <h3>Step {index + 1}</h3>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-muted rounded-lg p-6 mb-6 sticky top-6">
            <h3 className="font-bold text-lg mb-4">Nutrition Information</h3>
            {/* <div className="space-y-2">
              {recipe.nutrition.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-muted rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Chef's Tips</h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          {/* {recipe.relatedRecipes && recipe.relatedRecipes.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4">You Might Also Like</h3>
              <div className="space-y-4">
                {recipe.relatedRecipes.map((related) => (
                  <Link key={related.id} href={`/recipes/${related.id}`} className="block group">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={related.image || "/placeholder.svg?height=64&width=64"}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">{related.title}</h4>
                        <p className="text-sm text-muted-foreground">{related.cookingTime} mins</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

