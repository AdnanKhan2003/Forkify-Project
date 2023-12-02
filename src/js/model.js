import "core-js/stable";
import "regenerator-runtime";
import { API_URL, RES_PER_PAGE, API_KEY } from "./config.js";
import { AJAX } from "./helper.js";
import addRecipeView from "./view/addRecipeView.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: "",
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipe = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipe(data);
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
    1;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  console.log(recipe);
  state.bookmarks.push(recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex((bookmark) => (bookmark.id = id));
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmark();
};

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
console.log(state.bookmarks);

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        (entries) => entries[0].startsWith("ingredient") && entries[1] !== ""
      )
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    console.log(newRecipe);
    const recipe = {
      cooking_time: newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError();
    throw err;
  }
};
