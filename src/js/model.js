import { API_URL, API_KEY, RESULTS_BY_PAGE } from './config';
import { AJAX } from './helper';
/**
 * Store the Application Datas object.
 * @type {object}
 * @property {object} recipe
 * @property {object} search
 * @property {array} bookmarks
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsByPage: RESULTS_BY_PAGE,
  },
  bookmarks: [],
};
/**
 * Parse received datas to the recipe object.
 * @param {object} datas
 * @returns {object} recipe.
 */
const getRecipeObject = function (datas) {
  const { recipe } = datas.data;
  // Very nice trick to add a property if exists
  // ...(recipe.key && {key: recipe.key})
  return {
    cooking_time: recipe.cooking_time,
    id: recipe.id,
    image_url: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    source_url: recipe.source_url,
    title: recipe.title,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};
/**
 *
 * @param {*} id
 */
export const loadRecipe = async function (id) {
  try {
    const datas = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = getRecipeObject(datas);
    if (state.bookmarks.some(entry => entry.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (error) {
    throw new Error(error);
  }
};
export const uploadRecipe = async function (recipe) {
  // Covert the recipe Objet to an array.
  // Then filter it to get the ingredients.
  const ingredients = Object.entries(recipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      // const checkIng = ing[1].replaceAll(' ', '').split(',');
      const checkIng = ing[1].split(',').map(el => el.trim());
      if (checkIng.length !== 3) {
        throw new Error(`${ing[1]} => Wrong ingredient format`);
      }
      // Check if quantity is a number
      if (Number.isNaN(+checkIng[0])) {
        throw new Error(`${checkIng[0]} => must be a number`);
      }
      // array
      const [quantity, unit, description] = checkIng;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
  const recipeOutput = {
    cooking_time: +recipe.cookingTime,
    image_url: recipe.image,
    ingredients,
    publisher: recipe.publisher,
    servings: +recipe.servings,
    source_url: recipe.sourceUrl,
    title: recipe.title,
  };
  const datas = await AJAX(`${API_URL}?key=${API_KEY}`, recipeOutput);
  state.recipe = getRecipeObject(datas);
  addBookmark(state.recipe);
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const datas = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(`datas =>`, datas);
    state.search.results = datas.data.recipes.map(el => {
      return {
        id: el.id,
        image_url: el.image_url,
        publisher: el.publisher,
        title: el.title,
        ...(el.key && { key: el.key }),
      };
    });
    // RESET PAGINATION.
    state.search.page = 1;
    // console.log(`state.search.results =>`, state.search.results);
  } catch (error) {
    throw new Error(error);
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  // Memorize page
  state.search.page = page;
  const start = (page - 1) * state.search.resultsByPage;
  const end = page * state.search.resultsByPage;
  // Return a part of search results.
  return state.search.results.slice(start, end);
};

// SERVINGS
export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });
  state.recipe.servings = servings;
};

//BOOKMARKS
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark.
  state.bookmarks.push(recipe);
  // Set current recipe as bookmark.
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }
  // Add in localStorage.
  persistBookmarks();
};
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(entry => (entry.id = id));
  // Remove bookmark.
  state.bookmarks.splice(index, 1);
  // Set current recipe as not bookmarked.
  if (state.recipe.id === id) {
    state.recipe.bookmarked = false;
  }
  // Add in localStorage.
  persistBookmarks();
};

export const getStorage = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
