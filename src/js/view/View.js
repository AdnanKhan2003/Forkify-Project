import { mark } from "regenerator-runtime";
import icons from "../../img/icons.svg";

export default class View {
  _data;

  /**
   * render takes data and inserts it into DOM (returns string if 2nd parameter render is set to false)
   * @param {Object | Object[]} data The data to insert into generateMarkup() which generates HTML that which will be inserted into DOM
   * @param {Boolean} [render] By default true, it returns string instead of inserting data to the DOM
   * @returns {undefined | string} If true then data is inserted into the DOM but if false then the data is not inserted into the string rather it just returns a string
   * @this {Object} View instance
   * @author Adnan Khan
   * @todo Finsih Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return;
    }
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDOM.querySelectorAll("*"));
    const curElement = Array.from(this._parentEl.querySelectorAll("*"));

    newElement.forEach((newEle, i) => {
      const curEle = curElement[i];

      // Change SERVINGS
      if (
        !newEle.isEqualNode(curEle) &&
        newEle.firstChild?.nodeValue.trim() !== ""
      ) {
        curEle.textContent = newEle.textContent;
      }

      // Change ATTRIBUTES
      if (!newEle.isEqualNode(curEle)) {
        // console.log(newEle.attributes);
        Array.from(newEle.attributes).forEach((attr) =>
          curEle.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpinner = function () {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  };

  renderError(msg = this._msgError) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${msg}</p>
        </div>
        `;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(msg = this._message) {
    console.log(this._message);
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
