// This is a mock implementation of the Drupal API client
// In a real application, you would use next-drupal to fetch data from your Drupal backend

// Mock data for recipes
const mockRecipes = [
    {
      id: "1",
      title: "Spaghetti Carbonara",
      summary: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
      description:
        "Carbonara is an Italian pasta dish from Rome made with eggs, hard cheese, cured pork, and black pepper. The dish arrived at its modern form, with its current name, in the middle of the 20th century.",
      image: "/placeholder.svg?height=400&width=600",
      cookingTime: 30,
      difficulty: "Medium",
      servings: 4,
      featured: true,
      rating: 4.8,
      reviews: 124,
      category: "dinner",
      ingredients: [
        "400g spaghetti",
        "200g pancetta or guanciale, diced",
        "4 large eggs",
        "100g Pecorino Romano, grated",
        "50g Parmigiano Reggiano, grated",
        "Freshly ground black pepper",
        "Salt to taste",
      ],
      instructions: [
        "Bring a large pot of salted water to boil and cook the spaghetti until al dente.",
        "While the pasta is cooking, heat a large skillet over medium heat. Add the pancetta and cook until crispy, about 5-7 minutes.",
        "In a bowl, whisk together the eggs, grated cheeses, and a generous amount of black pepper.",
        "When the pasta is done, reserve 1 cup of the pasta water, then drain the pasta.",
        "Working quickly, add the hot pasta to the skillet with the pancetta, tossing to combine.",
        "Remove the skillet from the heat and add the egg and cheese mixture, tossing continuously until the eggs thicken but don't scramble. Add a splash of the reserved pasta water if needed to create a creamy sauce.",
        "Serve immediately with additional grated cheese and black pepper on top.",
      ],
      nutrition: [
        { name: "Calories", value: "650 kcal" },
        { name: "Protein", value: "30g" },
        { name: "Carbohydrates", value: "65g" },
        { name: "Fat", value: "28g" },
        { name: "Fiber", value: "3g" },
      ],
      tips: [
        "Use room temperature eggs to prevent them from seizing up when added to the hot pasta.",
        "Traditional carbonara doesn't include cream - the creaminess comes from the eggs and cheese.",
        "Toss the pasta quickly to ensure the eggs don't scramble but form a silky sauce.",
      ],
      relatedRecipes: [
        { id: "2", title: "Cacio e Pepe", image: "/placeholder.svg?height=64&width=64", cookingTime: 20 },
        { id: "3", title: "Pasta Amatriciana", image: "/placeholder.svg?height=64&width=64", cookingTime: 35 },
      ],
    },
    {
      id: "2",
      title: "Cacio e Pepe",
      summary: "A simple Roman pasta dish with cheese and black pepper.",
      description:
        "Cacio e Pepe is a pasta dish from the Roman cuisine. 'Cacio e Pepe' means 'cheese and pepper' in several central Italian dialects. As the name suggests, the ingredients are very simple and include only black pepper, Pecorino Romano cheese, and pasta.",
      image: "/placeholder.svg?height=400&width=600",
      cookingTime: 20,
      difficulty: "Easy",
    //   servings: 2,
      featured: true,
    //   rating: 4.6,
    //   reviews: 98,
      category: "dinner",
      ingredients: [
        "200g spaghetti or tonnarelli",
        "100g Pecorino Romano, grated",
        "2 tsp freshly ground black pepper",
        "Salt to taste",
      ],
      instructions: [
        "Bring a large pot of lightly salted water to boil and cook the pasta until al dente.",
        "While the pasta is cooking, toast the black pepper in a dry pan over medium heat for about 30 seconds to release its aroma.",
        "Reserve 1 cup of the pasta water before draining the pasta.",
        "In a bowl, mix the grated Pecorino Romano with a small amount of the reserved pasta water to create a paste.",
        "Add the drained pasta to the pan with the toasted pepper, then add the cheese paste and toss vigorously.",
        "Add more pasta water as needed to create a creamy sauce that coats the pasta.",
        "Serve immediately with additional grated cheese and black pepper on top.",
      ],
      nutrition: [
        { name: "Calories", value: "550 kcal" },
        { name: "Protein", value: "25g" },
        { name: "Carbohydrates", value: "60g" },
        { name: "Fat", value: "22g" },
        { name: "Fiber", value: "2g" },
      ],
      tips: [
        "The key to a good Cacio e Pepe is in the technique of creating the creamy sauce without the cheese clumping.",
        "Use freshly ground black pepper for the best flavor.",
        "Pecorino Romano is traditional, but you can substitute with Parmigiano Reggiano if needed.",
      ],
      relatedRecipes: [
        { id: "1", title: "Spaghetti Carbonara", image: "/placeholder.svg?height=64&width=64", cookingTime: 30 },
        { id: "3", title: "Pasta Amatriciana", image: "/placeholder.svg?height=64&width=64", cookingTime: 35 },
      ],
    },
    {
      id: "3",
      title: "Pasta Amatriciana",
      summary: "A traditional Italian pasta sauce based on guanciale, pecorino cheese, and tomato.",
      description:
        "Amatriciana is a traditional Italian pasta sauce based on guanciale (cured pork cheek), pecorino cheese, and tomato. Originating from the town of Amatrice, it is one of the most well-known pasta sauces in Roman and Italian cuisine.",
      image: "/placeholder.svg?height=400&width=600",
      cookingTime: 35,
      difficulty: "Medium",
      servings: 4,
      featured: false,
      rating: 4.7,
      reviews: 112,
      category: "dinner",
      ingredients: [
        "400g bucatini or spaghetti",
        "150g guanciale or pancetta, diced",
        "1 can (400g) San Marzano tomatoes, crushed",
        "1 red chili pepper, finely chopped",
        "100g Pecorino Romano, grated",
        "1 tbsp olive oil",
        "Salt to taste",
      ],
      instructions: [
        "Heat olive oil in a large skillet over medium heat. Add the guanciale and cook until crispy, about 5-7 minutes.",
        "Add the chopped chili pepper and cook for another minute.",
        "Add the crushed tomatoes and simmer for about 15-20 minutes, until the sauce thickens.",
        "Meanwhile, bring a large pot of salted water to boil and cook the pasta until al dente.",
        "Reserve 1/2 cup of pasta water, then drain the pasta.",
        "Add the pasta to the sauce, along with a splash of the reserved pasta water if needed.",
        "Remove from heat, stir in half of the grated Pecorino Romano, and toss to combine.",
        "Serve with the remaining Pecorino Romano sprinkled on top.",
      ],
      nutrition: [
        { name: "Calories", value: "600 kcal" },
        { name: "Protein", value: "25g" },
        { name: "Carbohydrates", value: "70g" },
        { name: "Fat", value: "25g" },
        { name: "Fiber", value: "4g" },
      ],
      tips: [
        "Authentic Amatriciana does not include onions or garlic, though some modern variations do.",
        "Bucatini is the traditional pasta for this sauce, but spaghetti works well too.",
        "For a spicier version, increase the amount of chili pepper.",
      ],
      relatedRecipes: [
        { id: "1", title: "Spaghetti Carbonara", image: "/placeholder.svg?height=64&width=64", cookingTime: 30 },
        { id: "2", title: "Cacio e Pepe", image: "/placeholder.svg?height=64&width=64", cookingTime: 20 },
      ],
    },
    {
      id: "4",
      title: "Avocado Toast with Poached Eggs",
      summary: "A nutritious breakfast featuring creamy avocado and perfectly poached eggs on toasted bread.",
      description:
        "Avocado toast has become a modern breakfast classic. This version is topped with perfectly poached eggs for added protein and a luxurious texture. It's simple to make but packed with nutrients to start your day right.",
      image: "/placeholder.svg?height=400&width=600",
      cookingTime: 15,
      difficulty: "Easy",
      servings: 2,
      featured: true,
      rating: 4.9,
      reviews: 87,
      category: "breakfast",
      ingredients: [
        "2 slices of sourdough bread",
        "1 ripe avocado",
        "2 fresh eggs",
        "1 tbsp white vinegar",
        "1/2 lemon, juiced",
        "Red pepper flakes (optional)",
        "Salt and freshly ground black pepper",
        "Fresh herbs (such as chives or cilantro) for garnish",
      ],
      instructions: [
        "Toast the bread slices until golden and crisp.",
        "Cut the avocado in half, remove the pit, and scoop the flesh into a bowl. Add lemon juice, salt, and pepper, then mash with a fork to your desired consistency.",
        "For the poached eggs, bring a pot of water to a gentle simmer and add the vinegar.",
        "Crack each egg into a small cup. Create a gentle whirlpool in the water and carefully slide each egg into the water.",
        "Cook for 3-4 minutes for a runny yolk, then remove with a slotted spoon and place on a paper towel to drain.",
        "Spread the mashed avocado on the toast slices, top each with a poached egg, and season with salt, pepper, and red pepper flakes if desired.",
        "Garnish with fresh herbs and serve immediately.",
      ],
      nutrition: [
        { name: "Calories", value: "350 kcal" },
        { name: "Protein", value: "15g" },
        { name: "Carbohydrates", value: "30g" },
        { name: "Fat", value: "20g" },
        { name: "Fiber", value: "8g" },
      ],
      tips: [
        "For the perfect poached egg, use the freshest eggs possible.",
        "Adding vinegar to the poaching water helps the egg whites coagulate faster.",
        "Try different toppings like feta cheese, cherry tomatoes, or microgreens for variety.",
      ],
      relatedRecipes: [
        { id: "5", title: "Breakfast Smoothie Bowl", image: "/placeholder.svg?height=64&width=64", cookingTime: 10 },
        { id: "6", title: "Vegetable Frittata", image: "/placeholder.svg?height=64&width=64", cookingTime: 25 },
      ],
    },
    {
      id: "5",
      title: "Breakfast Smoothie Bowl",
      summary: "A nutritious and colorful breakfast bowl packed with fruits, berries, and toppings.",
      description:
        "Smoothie bowls are a delicious and nutritious way to start your day. This recipe features a thick, creamy base of frozen fruits and is topped with granola, fresh berries, and seeds for added texture and nutrients.",
      image: "/placeholder.svg?height=400&width=600",
      cookingTime: 10,
      difficulty: "Easy",
      servings: 1,
      featured: false,
      rating: 4.7,
      reviews: 65,
      category: "breakfast",
      ingredients: [
        "1 frozen banana",
        "1 cup frozen mixed berries",
        "1/4 cup Greek yogurt",
        "1/4 cup almond milk (or milk of choice)",
        "1 tbsp honey or maple syrup (optional)",
        "Toppings: fresh berries, sliced banana, granola, chia seeds, coconut flakes",
      ],
      instructions: [
        "Place the frozen banana, mixed berries, Greek yogurt, and almond milk in a blender.",
        "Blend until smooth and creamy, adding more milk if needed to reach desired consistency. The mixture should be thicker than a regular smoothie.",
        "Taste and add honey or maple syrup if desired for additional sweetness.",
        "Pour the smoothie into a bowl.",
        "Arrange your choice of toppings artfully on top of the smoothie.",
        "Serve immediately and enjoy with a spoon.",
      ],
      nutrition: [
        { name: "Calories", value: "300 kcal" },
        { name: "Protein", value: "10g" },
        { name: "Carbohydrates", value: "55g" },
        { name: "Fat", value: "5g" },
        { name: "Fiber", value: "10g" },
      ],
      tips: [
        "For an extra thick smoothie bowl, use less liquid and make sure your fruits are completely frozen.",
        "Prepare freezer bags with portioned fruits in advance for quick morning preparation.",
        "Get creative with toppings and try different combinations for variety.",
      ],
      relatedRecipes: [
        {
          id: "4",
          title: "Avocado Toast with Poached Eggs",
          image: "/placeholder.svg?height=64&width=64",
          cookingTime: 15,
        },
        { id: "6", title: "Vegetable Frittata", image: "/placeholder.svg?height=64&width=64", cookingTime: 25 },
      ],
    },
    {
      id: "6",
      title: "Vegetable Frittata",
      summary: "A versatile and protein-rich egg dish loaded with colorful vegetables.",
      description:
        "Frittata is an Italian egg-based dish similar to an omelette or crustless quiche. This vegetable frittata is packed with colorful vegetables and herbs, making it perfect for breakfast, brunch, or even dinner.",
      image: "/placeholder.svg?height=400&width=600",
      cookingTime: 25,
      difficulty: "Medium",
      servings: 4,
      featured: true,
      rating: 4.6,
      reviews: 78,
      category: "breakfast",
      ingredients: [
        "8 large eggs",
        "1/4 cup milk",
        "1 red bell pepper, diced",
        "1 small zucchini, diced",
        "1/2 onion, finely chopped",
        "2 cloves garlic, minced",
        "1 cup spinach, roughly chopped",
        "1/2 cup grated cheese (cheddar, feta, or goat cheese)",
        "2 tbsp olive oil",
        "2 tbsp fresh herbs (parsley, basil, or chives), chopped",
        "Salt and freshly ground black pepper",
      ],
      instructions: [
        "Preheat the oven to 375°F (190°C).",
        "In a large bowl, whisk together the eggs and milk. Season with salt and pepper.",
        "Heat olive oil in an oven-safe skillet over medium heat. Add the onion and cook until softened, about 3-4 minutes.",
        "Add the bell pepper, zucchini, and garlic. Cook for another 5 minutes until vegetables are tender.",
        "Add the spinach and cook until wilted, about 1 minute.",
        "Pour the egg mixture over the vegetables in the skillet. Sprinkle the cheese and herbs on top.",
        "Cook on the stovetop for 3-4 minutes until the edges start to set.",
        "Transfer the skillet to the preheated oven and bake for 10-12 minutes, until the frittata is set and lightly golden on top.",
        "Let cool slightly before slicing and serving.",
      ],
      nutrition: [
        { name: "Calories", value: "250 kcal" },
        { name: "Protein", value: "18g" },
        { name: "Carbohydrates", value: "8g" },
        { name: "Fat", value: "17g" },
        { name: "Fiber", value: "2g" },
      ],
      tips: [
        "Use any vegetables you have on hand - frittatas are perfect for using up leftovers.",
        "For a dairy-free version, omit the cheese and use plant-based milk.",
        "Frittata can be served hot, at room temperature, or cold, making it great for meal prep.",
      ],
      relatedRecipes: [
        {
          id: "4",
          title: "Avocado Toast with Poached Eggs",
          image: "/placeholder.svg?height=64&width=64",
          cookingTime: 15,
        },
        { id: "5", title: "Breakfast Smoothie Bowl", image: "/placeholder.svg?height=64&width=64", cookingTime: 10 },
      ],
    },
  ]
  
  // Mock API functions
  export async function getFeaturedRecipes(limit?: number) {
    const featured = mockRecipes.filter((recipe) => recipe.featured)
    return limit ? featured.slice(0, limit) : featured
  }
  
  export async function getAllRecipes({ category = "", search = "" } = {}) {
    let filteredRecipes = [...mockRecipes]
  
    if (category) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.category.toLowerCase() === category.toLowerCase())
    }
  
    if (search) {
      const searchLower = search.toLowerCase()
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.summary.toLowerCase().includes(searchLower) ||
          recipe.description.toLowerCase().includes(searchLower),
      )
    }
  
    return filteredRecipes
  }
  
  export async function getRecipeById(id: string) {
    return mockRecipes.find((recipe) => recipe.id === id) || null
  }
  
  