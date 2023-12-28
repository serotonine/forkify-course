// With parcel we could import all sort of files.
import icons from 'url:../../img/icons.svg';
// Fracty library
import fracty from 'fracty';
// Parent Class
import View from './View';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No recipe found.';

  // DOM EVENTS
  addHandlerRender(handler) {
    // Click on recipe href
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerServings(handler) {
    // Click on recipe href
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--update-serving');
      if (!btn) {
        return;
      }
      const { updateServing } = btn.dataset;
      if (+updateServing > 0) {
        handler(+updateServing);
      }
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) {
        return;
      }
      handler();
    });
  }
  // MARKUP
  _getMarkup() {
    return `
  <figure class="recipe__fig">
    <img src="${this._datas.image_url}" alt="${
      this._datas.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._datas.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._datas.cooking_time
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._datas.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-serving" data-update-serving ="${
          this._datas.servings - 1
        }" >
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-serving" data-update-serving ="${
          this._datas.servings + 1
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated ${this._datas.key ? '' : 'hidden'}">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._datas.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
    </button>
  </div>x
  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${this._datas.ingredients
      .map(ing => this._getIngredientsMarkup(ing))
      .join(``)}
    </ul>
  </div>
  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._datas.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._datas.source_url}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  }
  // RENDER INGREDIENTS
  _getIngredientsMarkup(ing) {
    return `<li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
   ${
     ing.quantity
       ? `<div class="recipe__quantity">${fracty(ing.quantity)}</div>`
       : ``
   }
    <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>`;
  }
}

export default new RecipeView();
