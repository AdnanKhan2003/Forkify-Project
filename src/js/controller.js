import * as model from "./model.js";
import recipeView from "../js/view/recipeView.js";
import searchView from "./view/searchView.js";
import resultsView from "./view/resultsView.js";

import icons from "url:../img/icons.svg";
import "core-js/stable";
import "regenerator-runtime/runtime";
import paginationView from "./view/paginationView.js";
import bookmarkView from "./view/bookmarkView.js";
import addRecipeView from "./view/addRecipeView";
import { MODAL_CLOSE_SEC } from "./config.js";

// https://forkify-api.herokuapp.com/v2
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    // Get Hash from url (so to handle 'hashchange')
    let id = window.location.hash.slice(1);

    // If NO id
    if (!id) return;

    // Render Spinner until data is load
    recipeView.renderSpinner();

    // 0
    // resultsView.render(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());

    bookmarkView.update(model.state.bookmarks);

    // 1. Load Recipe
    await model.loadRecipe(id);

    // 2. Display Recipe
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`MY ERROR MESSAGE: ${err}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Load data
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Render data
    await model.loadSearchResults(query);

    // 3. Render data
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render pagination buttons
    paginationView.render(model.state.search);
    // console.log(model.state.search.results);
  } catch (err) {
    console.log(`This is my ${err}`);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW Pagination results
  paginationView.render(model.state.search);
};

const controlUpdateServings = function (servings) {
  // 1. Upadate servings
  model.updateServings(servings);

  // 2. Rendering Servings
  // recipeView.render(model.state.recipe);
  // OR
  // UPDATE SERVINGS
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Load Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // 2) Update Bookmark
  recipeView.update(model.state.recipe);

  // 3) Render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    // Render Spinner
    addRecipeView.renderSpinner();

    // 1. Upload data recipe
    await model.uploadRecipe(data);

    // 2. Render new recipe
    recipeView.render(model.state.recipe);

    // 3. Render message
    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    // 4. Change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // 5. Close window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
  }
  location.reload();
};

const init = function () {
  bookmarkView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log("Welcome");
};

init();
