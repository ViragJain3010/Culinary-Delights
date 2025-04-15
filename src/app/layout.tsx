import "@/app/globals.css";
// import { ThemeProvider } from "@/components/theme-provider"
import { RecipeProvider } from "@/context/recipe-context";
import { ThemeProvider } from "@/context/theme-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Delicious Recipes",
  description: "Discover and cook delicious recipes from around the world",
};

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RecipeProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </RecipeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
