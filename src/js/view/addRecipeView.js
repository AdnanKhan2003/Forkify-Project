import View from "./View.js";
import icons from "../../img/icons.svg";

class AddRecipeView extends View {
  _message = "Recipe was sucessfully uploaded";
  _parentEl = document.querySelector(".upload");
  _overlay = document.querySelector(".overlay");
  _window = document.querySelector(".add-recipe-window");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();

      // Select Data from form
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
