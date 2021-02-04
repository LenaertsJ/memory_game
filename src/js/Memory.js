//IMPORT CARD CLASS
import { Card } from "./Card";

// CREATE GAMEPLAY CLASS

export default class Memory {
  constructor(l = 3) {
    this._allIcons = [];
    this._level = l;
    this.getIcons();
    this._firstFlip = null;
    this._secondFlip = null;
    this._flips = [];
    this._matches = 0;
    this.setUpEvents();
  }

  // CREATE ARRAY WITH ICON NAMES
  getIcons() {
    fetch("../../icons/selection.json")
      .then((response) => response.json())
      .then((data) => {
        this._allIcons = data.icons.map((icon) => icon.properties.name);
        this.init();
      })
      .catch((error) => console.log(error));
  }

  // INITIALIZE GAME
  init() {
    const container = document.querySelector(".container");
    container.insertAdjacentHTML("beforeend", "<div class='gameboard'></div>");
    const title = document.querySelector(".title-box");
    title.insertAdjacentHTML(
      "beforeend",
      `<p class='level'>Level: ${this._level}`
    );
    this._matches = 0;
    this.play();
  }

  // SETUP GAMEPLAY
  play() {
    //SELECT UNIQUE ICONS BASED ON LEVEL
    const icons = [];
    const count = this._level * 2;
    while (icons.length !== count) {
      let randomIcon = this._allIcons[
        Math.floor(Math.random() * this._allIcons.length)
      ];
      if (icons.indexOf(randomIcon) === -1) {
        icons.push(randomIcon);
      }
    }

    //DUPLICATE ICONS ARRAY FOR MATCHING CARDS
    const allCards = [...icons, ...icons];

    //SHUFFLE FUNCTION
    function shuffle(a) {
      let i, s, x;
      for (i = a.length - 1; i > 0; i--) {
        s = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[s];
        a[s] = x;
      }
      return a;
    }

    //SHUFFLE ARRAY
    shuffle(allCards);

    //CREATE CARDS
    let n = allCards.length;
    const holder = document.querySelector(".gameboard");

    while (n > 0) {
      new Card(allCards.pop(), holder);
      n--;
    }
  }

  //LISTEN TO EVENTS
  setUpEvents = () => {
    window.addEventListener("flipped", (card) => {
      if (this._flips.length == 0) {
        this._firstFlip = card.detail;
        this._flips.push(this._firstFlip);
      } else if (this._flips.length == 1) {
        this._secondFlip = card.detail;
        this._flips.push(this._secondFlip);
        this.checkMatch();
      }
    });
  };

  //CHECK IF CARDS MATCH
  checkMatch = () => {
    if (this._firstFlip._icon === this._secondFlip._icon) {
      //make matched cards unflippable
      this._firstFlip._ref.onclick = null;
      this._secondFlip._ref.onclick = null;
      //empty array of flips to start a new turn
      this._flips = [];
      setTimeout(this.cardsMatch, 500);
      this._matches += 1;
      //if all matches are found : round ends (after 3 rounds game ends)
      if (this._matches == this._level * 2) {
        setTimeout(this.roundEnd, 1500);
      }
    } else {
      //no match : unflip cards
      setTimeout(this.unFlip, 700);
    }
  };

  //UNFLIP CARDS
  unFlip = () => {
    this._firstFlip._ref
      .querySelector(".card-inner")
      .classList.toggle("flipped");
    this._secondFlip._ref
      .querySelector(".card-inner")
      .classList.toggle("flipped");
    this._flips = [];
  };

  //WHOOHOO MATCHING CARDS
  cardsMatch = () => {
    this._firstFlip._ref
      .querySelector(".card-inner")
      .classList.toggle("matched");
    this._secondFlip._ref
      .querySelector(".card-inner")
      .classList.toggle("matched");
  };

  //END OF ROUND : ALL MATCHES FOUND (or game after 3 rounds)
  roundEnd = () => {
    //game ends after 3 succesful rounds
    if (this._level == 3) {
      window.alert(
        "Wow, you discovered all there is to discover! Your short-term memory and wildlife spotting skills are ace..."
      );
      //reset level to 0
      this._level = 0;
    } else {
      //end of round alert
      window.alert(
        "Nice work, you found all the pairs. Let's move on to new territory, where life is even more abundant!"
      );
    }
    //PREPARE NEW GAME
    //LEVEL UP
    this._level += 1;
    //REMOVE CURRENT GAMEBOARD
    const gameboard = document.querySelector(".gameboard");
    const level = document.querySelector(".level");
    gameboard.remove();
    level.remove();
    //INITIALIZE NEW GAME
    this.init();
  };
}
