// utils/api.js or wherever you store your API utilities
import axios from "axios";

export const fetchAllRecipes = async (page = 1, pageSize = 9) => {
  try {
    const url =
      `${process.env.NEXT_PUBLIC_API_URL}/node/recipe` +
      `?include=field_recipe_image.field_media_image` +
      `&fields[media--image]=field_media_image` +
      `&fields[file--file]=uri` +
      `&page[limit]=${pageSize}` +
      `&page[offset]=${(page - 1) * pageSize}` +
      `&sort=-created`;
    const response = await axios.get(url);
    console.log("🚀 ~ getAllRecipes ~ data:", response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};
