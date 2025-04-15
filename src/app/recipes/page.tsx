// src/app/recipes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRecipes } from "@/context/recipe-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Recipe } from "@/types/types";

export default function RecipesPage() {
  const { isLoading, error, recipes, pagination, setCurrentPage } =
    useRecipes();

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Recipes</h1>

      {/* Tabs for different views */}
      <Tabs defaultValue="grid" className="mb-8">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        {/* Grid View */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: Recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={`${recipe.image}`}
                    // src={`https://recipes.ddev.site${recipe.image}`}
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
                    <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <div className="space-y-4">
            {recipes.map((recipe: Recipe) => (
              <Card key={recipe.id}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                    <Image
                      src={
                        recipe.image || "/placeholder.svg?height=192&width=192"
                      }
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.cookingTime} mins</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {recipe.summary}
                    </p>
                    <div className="mt-auto">
                      <Button asChild>
                        <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {recipes.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {/* First page */}
            {pagination.currentPage > 2 && (
              <Button
                variant={pagination.currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
            )}

            {/* Ellipsis for skipped pages */}
            {pagination.currentPage > 3 && (
              <Button variant="outline" size="sm" disabled>
                ...
              </Button>
            )}

            {/* Previous page */}
            {pagination.currentPage > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                {pagination.currentPage - 1}
              </Button>
            )}

            {/* Current page */}
            <Button variant="default" size="sm">
              {pagination.currentPage}
            </Button>

            {/* Next page */}
            {pagination.currentPage < pagination.totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                {pagination.currentPage + 1}
              </Button>
            )}

            {/* Ellipsis for skipped pages */}
            {pagination.currentPage < pagination.totalPages - 2 && (
              <Button variant="outline" size="sm" disabled>
                ...
              </Button>
            )}

            {/* Last page */}
            {pagination.currentPage < pagination.totalPages - 1 && (
              <Button
                variant={
                  pagination.currentPage === pagination.totalPages
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                {pagination.totalPages}
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No recipes found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button asChild variant="outline">
            <Link href="/recipes">View All Recipes</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
