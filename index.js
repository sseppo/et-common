//"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
//var splide_1 = require("@splidejs/splide");
document.addEventListener("DOMContentLoaded", function () {
  // Change heqading on button click
  var button = document.querySelector("#testinappi");
  if (!button) return;
  button.addEventListener("click", function () {
    var heading = document.querySelector("#testiotsikko");
    if (!heading) return;
    heading.textContent = "seppo testigggggggi";
  });
  /*
    // Initialize Splide
    var splide = new splide_1.default(".splide", {
        type: "loop",
        perPage: 3,
    });
    splide.mount();
    */
});
console.log(" najy jee?");
