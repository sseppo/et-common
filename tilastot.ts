import { airtable_getTable } from "./src/airtable/airtable_database";
import { infoFromJotForm } from "./src/jotform/jotform_tilastot";
import { infoFromAirTable } from "./src/airtable/airtable_tilastot";

document.addEventListener("DOMContentLoaded", function () {
  const haku = async () => {
    // await infoFromJotForm();

    await infoFromAirTable();
    console.log("Fetching data from Airtable...");

    // base alkaa urlissa app, taulu tbl ja view viw
    // esim. kisalitastot iKSPqfUYnu75OJ/tblaT7eERmAgRsYKC
    // ta PErusta aT7eERmAgRsYKC
    // const airtable_Kisatilastot = "appiKSPqfUYnu75OJ";
    // const airtable_Kisatilastot_Perusta = "tblaT7eERmAgRsYKC";
    // await airtable_getTable(airtable_Kisatilastot, airtable_Kisatilastot_Perusta);
  };

  const asyncApu = async () => {
    await haku();
  };
  asyncApu();
});
