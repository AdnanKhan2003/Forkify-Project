import View from "./View.js";

class searchView extends View {
  _parentEl = document.querySelector(".search");

  getQuery() {
    const query = this._parentEl.querySelector(".search__field").value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this._parentEl.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", (e) => {
      e.preventDefault();

      handler();
    });
  }
}

export default new searchView();
