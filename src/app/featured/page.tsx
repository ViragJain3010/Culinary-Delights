"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { drupal } from "@/lib/drupal";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Recipe } from "@/types/types";

const TOTAL_PAGES = 5;

function drupalNodeToRecipe(node: any): Recipe {
  return {
    id: node.id,
    title: node.title,
    summary: node.field_summary?.value || "",
    image: node.field_recipe_image?.field_media_image?.uri?.url
      ? "https://recipes.ddev.site" +
        node.field_recipe_image.field_media_image.uri.url
      : "/placeholder.svg?height=400&width=600",
    cookingTime: node.field_cooking_time || 0,
    difficulty: node.field_difficulty || "Easy",
    ingredients: node.field_ingredients || [],
    instructions: node.field_instructions?.value || [],
    category: node.field_recipe_category || "",
    featured: node.field_featured || false,
    path: node.path?.alias || `/recipes/${node.id}`,
  };
}

export default function FeaturedPage() {
  const [page, setPage] = useState<number>(1);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchFeaturedRecipes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const view = await drupal.getView(`featured_recipes--block_1`, {
        params: {
          include: "field_recipe_image.field_media_image",
          "fields[media--image]": "field_media_image",
          "fields[file--file]": "uri",
          "page[limit]": 9,
          "page[offset]": (page - 1) * 9,
          sort: "-created",
        },
      });
      setRecipes(view.results.map(drupalNodeToRecipe));
    } catch (err) {
      setError("Failed to fetch recipes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRecipes();
  }, [page]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={fetchFeaturedRecipes}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Featured Recipes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our collection of standout recipes, hand-picked by our chefs for their
          exceptional taste and popularity.
        </p>
      </section>

      {/* Featured Recipe of the Month */}
      {recipes.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Recipe of the Month</h2>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={recipes[0].image}
                  alt={recipes[0].title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <CardHeader className="px-0 pt-0">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                    Featured
                  </div>
                  <CardTitle className="text-2xl">{recipes[0].title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{recipes[0].cookingTime} mins</span>
                    <span className="mx-2">•</span>
                    <Utensils className="h-4 w-4" />
                    <span>{recipes[0].difficulty}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-4">
                  <p className="text-muted-foreground">{recipes[0].summary}</p>
                </CardContent>
                <CardFooter className="px-0 pt-4 mt-auto">
                  <Button asChild>
                    <Link href={recipes[0].path}>View Recipe</Link>
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
          {recipes.slice(1).map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Featured
                  </span>
                </div>
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
                <p className="line-clamp-2 text-muted-foreground">
                  {recipe.summary}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={recipe.path}>View Recipe</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {[...Array(TOTAL_PAGES)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === TOTAL_PAGES}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
