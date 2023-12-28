// Import MVC components.
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchResultsView from './views/searchResultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { CLOSE_WINDOW_TIMEOUT } from './config';
//https://jsdoc.app/

//// TODO ////
/* - Display total number of page in pagination
- Perform ingredients validation in the addRecipe Form
-  */
// Build final application
// https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/22649661#overview
//https://app.netlify.com/
//https://serotonine-forkify-v1.netlify.app/

// Polyfills.
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// DOM
const recipeContainer = document.querySelector('.recipe');
const recipeMessage = document.querySelector('.message');

// https://forkify-api.herokuapp.com/v2

////// CONTROLS /////
// Get recipe.
const controlRecipe = async function () {
  const id = window.location.hash.slice(1);
  if (!id) {
    return;
  }
  recipeView.renderSpinner();
  try {
    // 0. Update search list to display the active link.
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1. load recipe.
    await model.loadRecipe(id);
    // 2. Render recipe.
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};
// Get search results.
const controlSearchResults = async function () {
  const query = searchView.getQuery();
  if (!query) {
    return;
  }
  searchResultsView.renderSpinner();
  try {
    // 1. load search result.
    const searchResults = await model.loadSearchResult(query);
    //console.log(`searchResults =>`, model.state.search.results);
    // 2. Render search results.
    /* searchResultsView.render(model.state.search.results); */
    // 2. Render search results.
    searchResultsView.render(model.getSearchResultsPage());
    // 3. Render pagination.
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};
// Increase || decrease servings.
const controlServings = function (servings) {
  // 1. Set new quantities.
  model.updateServings(servings);
  // 2. Render recipe.
  recipeView.update(model.state.recipe);
};
// Pagination.
const controlPagination = function (index) {
  // 2. Render search results.
  searchResultsView.render(model.getSearchResultsPage(index));
  // 3. Render pagination.
  paginationView.render(model.state.search);
};
// Bookmarks.
const controlAddBookmark = function () {
  // 1. Add || Remove bookmark.
  model.state.recipe.bookmarked
    ? model.removeBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  // 2. Update recipe's bookmark icon.
  recipeView.update(model.state.recipe);
  // 3. Render bookmark's list
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarksStorage = function () {
  bookmarksView.render(model.state.bookmarks);
};
// Receive new recipe datas.
const controlAddRecipe = async function (recipe) {
  try {
    // Render spinner.
    addRecipeView.renderSpinner();
    // AJAX upload.
    await model.uploadRecipe(recipe);
    //console.log(`newRecipe =>`, model.state.recipe);
    // Success message.
    addRecipeView.renderSuccess();
    // Close form.
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, CLOSE_WINDOW_TIMEOUT);
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Update url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Render recipe.
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(`error =>`, error);
    addRecipeView.renderError(error.message);
  }
};

///// INIT ////
(function () {
  model.getStorage();
  bookmarksView.addHandlerBookmarksStorage(controlBookmarksStorage);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
})();
