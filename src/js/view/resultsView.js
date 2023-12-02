import View from "./View.js";
import icons from "../../img/icons.svg";
import previewView from "./previewView.js";

class Results extends View {
  _parentEl = document.querySelector(".results");
  _msgError = "NO such query found!";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new Results();
