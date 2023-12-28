// Parent Class
import View from './View';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succefully uploaded!';
  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerToggleWindow();
  }
  _getMarkup() {}

  // DOM EVENTS
  _toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');
  }
  _addHandlerToggleWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlayElement.addEventListener(
      'click',
      this._toggleWindow.bind(this)
    );
  }
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // FormData. Spread into an array.
      const datasTab = [...new FormData(this)];
      // Transforms a list of key-value pairs into an object.
      const datas = Object.fromEntries(datasTab);
      handler(datas);
    });
  }
}

export default new AddRecipeView();
