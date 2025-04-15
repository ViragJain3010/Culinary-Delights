// src/app/page.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Clock } from "lucide-react"
import Image from "next/image"
import { useRecipes } from "@/context/recipe-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Recipe } from "@/types/types"

export default function Home() {
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

  // Get the first 3 featured recipes for the homepage
  const homepageFeatured = featuredRecipes.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Discover Delicious Recipes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Explore our collection of mouthwatering recipes from around the world, perfect for any occasion and skill
          level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/featured">Featured Dishes</Link>
          </Button>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Recipes</h2>
          <Button asChild variant="ghost">
            <Link href="/featured">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageFeatured.map((recipe: Recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={recipe.image}
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

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recipe Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {["Breakfast", "Lunch", "Dinner", "Desserts", "Vegetarian", "Vegan", "Quick Meals", "Healthy"].map(
            (category) => (
              <Link key={category} href={`/recipes?category=${category.toLowerCase()}`} className="group">
                <div className="bg-muted rounded-lg p-6 text-center transition-all hover:bg-primary hover:text-primary-foreground">
                  <ChefHat className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-medium">{category}</h3>
                </div>
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  )
}

