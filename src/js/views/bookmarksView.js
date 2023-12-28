// Parent Class
import View from './View';
// Child Class
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nic recipe and bookmark it!';

  _getMarkup() {
    return `${this._datas
      .map(bookmark => previewView.render(bookmark, false))
      .join(``)}`;
  }

  // Display LocalStorage.
  addHandlerBookmarksStorage = function (handler) {
    window.addEventListener('load', handler);
  };
}
export default new BookmarksView();
