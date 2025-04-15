// src/app/featured/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Clock, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRecipes } from "@/context/recipe-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Recipe } from "@/types/types"

export default function FeaturedPage() {
  const { featuredRecipes, isLoading, error } = useRecipes()

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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Featured Recipes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our collection of standout recipes, hand-picked by our chefs for their exceptional taste and popularity.
        </p>
      </section>

      {/* Featured Recipe of the Month */}
      {featuredRecipes.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Recipe of the Month</h2>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredRecipes[0].image || "/placeholder.svg?height=400&width=600"}
                  alt={featuredRecipes[0].title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <CardHeader className="px-0 pt-0">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                    Featured
                  </div>
                  <CardTitle className="text-2xl">{featuredRecipes[0].title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{featuredRecipes[0].cookingTime} mins</span>
                    <span className="mx-2">•</span>
                    <Utensils className="h-4 w-4" />
                    <span>{featuredRecipes[0].difficulty}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-4">
                  <p className="text-muted-foreground">{featuredRecipes[0].summary}</p>
                </CardContent>
                <CardFooter className="px-0 pt-4 mt-auto">
                  <Button asChild>
                    <Link href={`/recipes/${featuredRecipes[0].id}`}>View Recipe</Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* All Featured Recipes */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Featured Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.slice(1).map((recipe: Recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Featured
                  </span>
                </div>
                <Image
                  src={recipe.image || "/placeholder.svg?height=192&width=384"}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookingTime} mins</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground">{recipe.summary}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

