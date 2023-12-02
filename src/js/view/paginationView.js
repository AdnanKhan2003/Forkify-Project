import View from "./View.js";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const noOfPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1. Page 1, Other Pages (only NEXT btn)
    if (curPage === 1 && noOfPage > 1) {
      return this._generateMarkupNext(curPage);
    }

    // 2. Last Page (only PREV btn)
    if (curPage === noOfPage && noOfPage > 1) {
      return this._generateMarkupPrev(curPage);
    }

    // 3. Other Pages (both NEXT and PREV btn)
    if (curPage < noOfPage) {
      return [
        this._generateMarkupPrev(curPage),
        this._generateMarkupNext(curPage),
      ];
    }

    // 4. Page 1, No other Pages (NO btn)
    return "";
  }

  _generateMarkupPrev(curPage) {
    return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>`;
  }

  _generateMarkupNext(curPage) {
    return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> 
    `;
  }

  addHandlerPagination() {}
}

export default new PaginationView();
