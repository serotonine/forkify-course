// With parcel we could import all sort of files.
import icons from 'url:../../img/icons.svg';
// Parent Class
import View from './View';

class PreviewView extends View {
  _parentElement = '';

  _getMarkup() {
    const hash = location.hash.slice(1);
    return `<li class="preview">
      <a class="preview__link ${
        hash === this._datas.id ? 'preview__link--active' : ''
      }" href="#${this._datas.id}">
        <figure class="preview__fig">
          <img src="${this._datas.image_url}" alt="${this._datas.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._datas.title}</h4>
          <p class="preview__publisher">T${this._datas.publisher}</p>
          <div class="preview__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>`;
  }
}
export default new PreviewView();
