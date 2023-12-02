import View from "./View.js";
import icons from "../../img/icons.svg";
import previewView from "./previewView.js";

class Bookmarks extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _msgError = "No recipes found for your query! Please try again!";

  addHandlerBookmark(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new Bookmarks();
