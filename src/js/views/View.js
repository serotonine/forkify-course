// With parcel we could import all sort of files.
import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;
  _datas;
  _errorMessage;
  _message;

  /**
   * Render the recieved object to the DOM.
   * @param {object | object[]} datas The datas to be rendered. E.G recipe.
   * @param {boolean} [render =true] False : create markup string , true: inserted straight in the DOM.
   * @returns {undefined | string} Return a string if param render is false.
   * @author Jonas Schmedman
   */
  render(datas, render = true) {
    if (!datas || (Array.isArray(datas) && datas.length === 0)) {
      return this.renderError();
    }
    this._datas = datas;
    if (!render) {
      return this._getMarkup();
    }
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', this._getMarkup());
  }

  /**
   * Only the changed part are rendered to the DOM.
   * @param {object| object[]} datas
   * @returns undefined
   */
  update(datas) {
    // UPDATE ONLY CHANGED MARKUP
    // https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/22649619
    this._datas = datas;
    const newMarkup = this._getMarkup();
    // Convert this Markup string
    // to a DOM object
    // living in the memory.
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newElements.forEach((newEl, index) => {
      const currentEl = currentElements[index];
      if (!newEl.isEqualNode(currentEl)) {
        // Change text.
        if (newEl.firstChild?.nodeValue.trim() !== '')
          currentEl.textContent = newEl.textContent;
      }
      // Change attribute value.
      Array.from(newEl.attributes).forEach(attr =>
        currentEl.setAttribute(attr.name, attr.value)
      );
    });
  }
  /**
   * Insert spinner markup in the parent element (this._parentElement).
   * @returns  {undefined}
   */
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
  /**
   * Empty DOM parent element (this._parentElement).
   * @returns {undefined}
   */
  _clear() {
    this._parentElement.innerHTML = ``;
  }
  /**
   * Insert Error message markup in the  DOM parent element (this._parentElement).
   * @param {string} [error = this._errorMessage]
   */
  renderError(error = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${error}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Insert Success message markup in the  DOM parent element (this._parentElement).
   * @param {string} [success = this._message]
   */
  renderSuccess(success = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${success}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
