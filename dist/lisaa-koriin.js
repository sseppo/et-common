(() => {
  // lisaa-koriin.ts
  var kori = [];
  console.log("kori 1: ", kori);
  var storageKori = localStorage.getItem("kori");
  if (storageKori !== null) {
    kori.push(storageKori);
  } else {
    console.log(" ei ollut koria");
  }
  console.log("kori 2: ", kori);
  document.addEventListener("DOMContentLoaded", function() {
    const addToCart = (item) => {
      console.log("item: ", item);
      console.log("kori 3: ", kori);
      kori.push(item);
      localStorage.setItem("kori 4", JSON.stringify(kori));
      console.log(" korissa on nyt ", kori);
      console.log("etitaan info..: ");
      var ostoskoriInfo = document.querySelector("#ostoskoriin-info");
      console.log("ostoskoriInfo: ", ostoskoriInfo);
      if (!ostoskoriInfo) return;
      console.log("sit muutetaan sit\xE4..");
      if (ostoskoriInfo.style.display === "none" || ostoskoriInfo.style.display === "") {
        console.log("nyt muutos....22");
        ostoskoriInfo.style.display = "block";
      }
      if (ostoskoriInfo.style.visibility === "hidden" || ostoskoriInfo.style.visibility === "" || ostoskoriInfo.style.visibility === null) {
        console.log("nyt muutos....");
        ostoskoriInfo.style.visibility = "visible";
      }
      var heading = document.querySelector("#testiotsikko");
      if (!heading) return;
      heading.textContent = item;
    };
    var rodeoharka = document.querySelector("#lisaa-koriin-rodeoharka");
    if (rodeoharka) {
      rodeoharka.addEventListener("click", function() {
        addToCart("rodeoharka");
      });
    }
    var boxer = document.querySelector("#lisaa-koriin-boxer");
    if (boxer) {
      boxer.addEventListener("click", function() {
        addToCart("boxer");
      });
    }
    var reaktio = document.querySelector("#lisaa-koriin-reaktio");
    if (reaktio) {
      reaktio.addEventListener("click", function() {
        addToCart("reaktio");
      });
    }
    var kicker = document.querySelector("#lisaa-koriin-kicker");
    if (kicker) {
      kicker.addEventListener("click", function() {
        addToCart("kicker");
      });
    }
    var roikunta = document.querySelector("#lisaa-koriin-roikunta");
    if (roikunta) {
      roikunta.addEventListener("click", function() {
        addToCart("roikunta");
      });
    }
    var sumot = document.querySelector("#lisaa-koriin-sumot");
    if (sumot) {
      sumot.addEventListener("click", function() {
        addToCart("sumot");
      });
    }
    var testinappi = document.querySelector("#testinappi");
    if (testinappi) {
      testinappi.addEventListener("click", function() {
        addToCart("testinappi");
      });
    }
  });
  console.log("kori aktivoitu");
})();
