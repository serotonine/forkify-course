import icons from 'url:../../img/icons.svg';
// Parent Class
import View from './View';
// Import constants
import { RESULTS_BY_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _getMarkup() {
    const numPages = Math.ceil(this._datas.results.length / RESULTS_BY_PAGE);
    const currentPage = this._datas.page;
    // Page 1 and there are other pages.
    if (currentPage === 1 && numPages > 1) {
      return ` <button class="btn--inline pagination__btn--next" data-goto= "${
        currentPage + 1
      }">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    // Last page.
    if (currentPage === numPages && numPages > 1) {
      return `<button class="btn--inline pagination__btn--prev" data-goto= "${
        currentPage - 1
      }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>`;
    }
    // Other page.
    if (currentPage < numPages) {
      return `<button class="btn--inline pagination__btn--prev" data-goto= "${
        currentPage - 1
      }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    <button class="btn--inline pagination__btn--next" data-goto= "${
      currentPage + 1
    }">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    // Page 1 and there are NOT other pages.
    return ``;
  }
  // DOM EVENTS
  addHandlerPagination(handler) {
    // Click on pagination btn parent
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) {
        return;
      }
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
}
export default new PaginationView();
