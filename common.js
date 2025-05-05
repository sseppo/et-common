var kori = [];
console.log("kori 1: ", kori);
var storageKori = localStorage.getItem("kori");
if (storageKori !== null) {
  kori.push(storageKori);
} else {
  console.log(" ei ollut koria");
  // kori = [];
}
console.log("kori 2: ", kori);

document.addEventListener("DOMContentLoaded", function () {
  const addToCart = (item) => {
    console.log("item: ", item);
    console.log("kori 3: ", kori);
    /*
    var kori = [];
    var kori = JSON.parse(localStorage.getItem("kori"));
    if (!kori) {
      kori = [];
    }
*/
    /*
    var uusikori = [];
    uusikori = kori;
    uusikori.push(...kori, item);

    */
    kori.push(item);
    localStorage.setItem("kori 4", kori);
    console.log(" korissa on nyt ", kori);
    //kori = JSON.parse(localStorage.getItem("kori"));
    //console.log("ja sit korissa on nyt ", kori);

    var heading = document.querySelector("#testiotsikko");
    if (!heading) return;
    heading.textContent = item;
  };
  // Change heqading on button click
  var button = document.querySelector("#lisaa-koriin-rodeoharka");

  if (!button) return;
  button.addEventListener("click", function () {
    addToCart("rodeoharka");
    /*
    var laite = button.attributes.getNamedItem("laite");
    console.log("leite: ", laite);
    var heading = document.querySelector("#testiotsikko");
    if (!heading) return;
    heading.textContent = laite.nodeValue;
    */
  });

  var button = document.querySelector("#lisaa-koriin-boxer");
  if (!button) return;
  button.addEventListener("click", function () {
    addToCart("boxer");
  });
});
console.log(" najy jee?");
