export class Card {
  constructor(icon, holder) {
    this._holder = holder;
    this._icon = icon;
    this._ref = this.init();
    this._isFlipped = false;
    this._gotFlipped = new CustomEvent("flipped", { detail: this });
    this.setUpEvents();
  }

  //CREATE CARD AND SAVE AS THIS.REF
  init() {
    this._holder.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
        <div class="card-inner">
          <div class="card-front">
          </div>
          <div class="card-back">
            <svg class="icon icon-${this._icon}">
                <use xlink:href="./icons/symbol-defs.svg#icon-${this._icon}"></use>
            </svg>
          </div>
        </div>
      </div>`
    );
    return this._holder.querySelector(".card:last-child");
  }

  //CREATE FLIP EVENT
  setUpEvents = () => (this._ref.onclick = this.flipCard);

  //CREATE FLIP FUNCTION
  flipCard = () => {
    if (!this._isFlipped) {
      this._ref.querySelector(".card-inner").classList.toggle("flipped");
      this._isFlipped = true;
      dispatchEvent(this._gotFlipped);
    } else {
      this._isFlipped = false;
    }
  };
}
