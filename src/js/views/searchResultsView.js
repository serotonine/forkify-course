// Parent Class
import View from './View';
// Child Class
import previewView from './previewView';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query';
  _message;
  _getMarkup() {
    return `${this._datas
      .map(data => previewView.render(data, false))
      .join(``)}`;
  }
}
export default new SearchResultsView();
