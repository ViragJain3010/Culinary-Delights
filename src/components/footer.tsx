import Link from "next/link"
import { ChefHat } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-6 w-6" />
              <span className="font-bold text-xl">Culinary Delights</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Discover delicious recipes from around the world, perfect for any occasion and skill level.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-muted-foreground hover:text-foreground transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/recipes?category=breakfast"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Breakfast
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?category=lunch"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Lunch
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?category=dinner"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dinner
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?category=desserts"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Desserts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Delicious Recipes. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

