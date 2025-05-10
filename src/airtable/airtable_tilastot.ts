import { AirtableRecord, AirtableResponse, rankedList } from "../../types/airtable_types";
import { airtable_getTable } from "./airtable_database";
import {
  getTopResults,
  filterByRecordValue,
  filterByMultipleRecordValues,
  arrangeByRank,
  prepareHTML,
  sortByBestOf,
} from "./airtable_funktiot";
import { refreshPage } from "../webflow/weblof";

var fromAirtable: AirtableResponse = {
  records: [],
};
/*
const rodeoBullResults = async () => {
  var tableDataRecords = fromAirtable.records;
  // filters
  tableDataRecords = await filterByRecordValue(tableDataRecords, "Laji", "Rodeo Bull");

  rodeoBullResultsStudents(rodeobullTable);
};
*/
const tulostaSivuille = async (list: AirtableRecord[], placement: string, printStyle: string) => {
  if (list) {
    const rankedList: rankedList | null = await arrangeByRank(list);

    if (rankedList) {
      // console.log("rankedList", rankedList);
      rankedList.referenceId = placement;
      rankedList.insertAtDivId = placement;

      const toHTML = await prepareHTML(rankedList, printStyle);
      // console.log("toHTML", toHTML);

      const paikkaSivulla = document.querySelector("#" + placement);

      if (!paikkaSivulla || !toHTML) return;

      paikkaSivulla.innerHTML = toHTML;
    }
  }
};

const rodeoBullResultsStudents = async () => {
  var tableDataRecords = fromAirtable.records;

  console.log("tableDataRecords HÄRKÄ", tableDataRecords);

  const suorittajiaYksi = async () => {
    // filters
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Rodeohärkä - normaali",
      Sarja: "Opiskelija",
      "Montako oli yhtä aikaa kyydissä?": "1 - yksilösuoritus",
    });

    console.log("recordsSet", recordsSet);
    const opiskelijat = await getTopResults(recordsSet);
    console.log("Top 10 Rodeo Bull Results (Students):", opiskelijat);

    const opintolinjat = await sortByBestOf(recordsSet, "Opintolinja", "desc");
    console.log("Opintolinjat", opintolinjat);

    const oppilaitokset = await sortByBestOf(recordsSet, "Oppilaitos", "desc");

    // tulosta sarjat
    if (opiskelijat) {
      tulostaSivuille(recordsSet, "o-r-n-1", "style-1");
    }
    if (oppilaitokset) {
      tulostaSivuille(oppilaitokset, "oppilaitos-rh-1", "style-2");
    }
    if (opintolinjat) {
      tulostaSivuille(opintolinjat, "opintolinja-rh-1", "style-3");
    }
  };

  const suorittajiaKaksi = async () => {
    // filters
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Rodeohärkä - normaali",
      Sarja: "Opiskelija",
      "Montako oli yhtä aikaa kyydissä?": "2 - 2 päällä!",
    });

    console.log("recordsSet", recordsSet);
    const opiskelijat = await getTopResults(recordsSet);
    console.log("Top 10 Rodeo Bull 2 Results (Students):", opiskelijat);

    const opintolinjat = await sortByBestOf(recordsSet, "Opintolinja", "desc");
    console.log("Opintolinjat 2", opintolinjat);

    const oppilaitokset = await sortByBestOf(recordsSet, "Oppilaitos", "desc");

    // tulosta sarjat
    if (opiskelijat) {
      tulostaSivuille(recordsSet, "o-r-n-2", "style-1");
    }
    if (oppilaitokset) {
      tulostaSivuille(oppilaitokset, "oppilaitos-rh-2", "style-2");
    }
    if (opintolinjat) {
      tulostaSivuille(opintolinjat, "opintolinja-rh-2", "style-3");
    }
  };

  const suorittajiaKolme = async () => {
    // filters
    console.log(" -- 3 -- ", tableDataRecords);
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Rodeohärkä - normaali",
      Sarja: "Opiskelija",
      "Montako oli yhtä aikaa kyydissä?": "3 - 3 päällä!",
    });

    console.log("recordsSet", recordsSet);
    const opiskelijat = await getTopResults(recordsSet);
    console.log("Top 10 Rodeo Bull 3 Results (Students):", opiskelijat);

    const opintolinjat = await sortByBestOf(recordsSet, "Opintolinja", "desc");
    console.log("Opintolinjat 3", opintolinjat);

    const oppilaitokset = await sortByBestOf(recordsSet, "Oppilaitos", "desc");

    // tulosta sarjat
    if (opiskelijat) {
      tulostaSivuille(recordsSet, "o-r-n-3", "style-1");
    }
    if (oppilaitokset) {
      tulostaSivuille(oppilaitokset, "oppilaitos-rh-3", "style-2");
    }
    if (opintolinjat) {
      tulostaSivuille(opintolinjat, "opintolinja-rh-3", "style-3");
    }
  };

  const asyncApu = async () => {
    await suorittajiaYksi();
    await suorittajiaKaksi();
    await suorittajiaKolme();
  };
  await asyncApu();
};

const rodeoAnkkaResultsStudents = async () => {
  var tableDataRecords = fromAirtable.records;

  console.log("tableDataRecords ANKKA", tableDataRecords);

  const suorittajiaYksi = async () => {
    // filters
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Ankkarodeo - normaali",
      Sarja: "Opiskelija",
      "Montako oli yhtä aikaa kyydissä?": "1 - yksilösuoritus",
    });

    console.log("recordsSet", recordsSet);
    const opiskelijat = await getTopResults(recordsSet);
    console.log("Top 10 Rodeo Ankka 1 Results (Students):", opiskelijat);

    const opintolinjat = await sortByBestOf(recordsSet, "Opintolinja", "desc");
    console.log("Opintolinjat", opintolinjat);

    const oppilaitokset = await sortByBestOf(recordsSet, "Oppilaitos", "desc");

    // tulosta sarjat
    if (opiskelijat) {
      tulostaSivuille(recordsSet, "o-a-n-1", "style-1");
    }
    if (oppilaitokset) {
      tulostaSivuille(oppilaitokset, "oppilaitos-a-1", "style-2");
    }
    if (opintolinjat) {
      tulostaSivuille(opintolinjat, "opintolinja-a-1", "style-3");
    }
  };

  const suorittajiaKaksi = async () => {
    // filters
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Ankkarodeo - normaali",
      Sarja: "Opiskelija",
      "Montako oli yhtä aikaa kyydissä?": "2 - 2 päällä!",
    });

    console.log("recordsSet", recordsSet);
    const opiskelijat = await getTopResults(recordsSet);
    console.log("Top 10 Rodeo Ankka 2 Results (Students):", opiskelijat);

    const opintolinjat = await sortByBestOf(recordsSet, "Opintolinja", "desc");
    console.log("Opintolinjat", opintolinjat);

    const oppilaitokset = await sortByBestOf(recordsSet, "Oppilaitos", "desc");

    // tulosta sarjat
    if (opiskelijat) {
      tulostaSivuille(recordsSet, "o-a-n-2", "style-1");
    }
    if (oppilaitokset) {
      tulostaSivuille(oppilaitokset, "oppilaitos-a-2", "style-2");
    }
    if (opintolinjat) {
      tulostaSivuille(opintolinjat, "opintolinja-a-2", "style-3");
    }
  };
  const suorittajiaKolme = async () => {
    // filters
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Ankkarodeo - normaali",
      Sarja: "Opiskelija",
      "Montako oli yhtä aikaa kyydissä?": "3 - 3 päällä!",
    });

    console.log("recordsSet", recordsSet);
    const opiskelijat = await getTopResults(recordsSet);
    console.log("Top 10 Rodeo Ankka 3  Results (Students):", opiskelijat);

    const opintolinjat = await sortByBestOf(recordsSet, "Opintolinja", "desc");
    console.log("Opintolinja", opintolinjat);

    const oppilaitokset = await sortByBestOf(recordsSet, "Oppilaitos", "desc");

    // tulosta sarjat
    if (opiskelijat) {
      tulostaSivuille(recordsSet, "o-a-n-3", "style-1");
    }
    if (oppilaitokset) {
      tulostaSivuille(oppilaitokset, "oppilaitos-a-3", "style-2");
    }
    if (opintolinjat) {
      tulostaSivuille(opintolinjat, "opintolinja-a-3", "style-3");
    }
  };
  const asyncApu = async () => {
    await suorittajiaYksi();
    await suorittajiaKaksi();
    await suorittajiaKolme();
  };
  await asyncApu();
};

const rodeoBullResultsArtists = async () => {
  var tableDataRecords = fromAirtable.records;

  console.log("tableDataRecords ARTISTI", tableDataRecords);

  const suorittajiaYksi = async () => {
    // filters
    const recordsSet = await filterByMultipleRecordValues(tableDataRecords, {
      Laji: "Rodeohärkä - normaali",
      Sarja: "Artisti",
      "Montako oli yhtä aikaa kyydissä?": "1 - yksilösuoritus",
    });

    console.log("recordsSet", recordsSet);

    const artistit = await sortByBestOf(recordsSet, "Tulos, sekunteina", "desc");

    // tulosta sarjat
    if (artistit) {
      tulostaSivuille(artistit, "a-r-n-1", "style-1");
    }
  };

  const asyncApu = async () => {
    await suorittajiaYksi();
  };
  await asyncApu();
};

export const infoFromAirTable = async () => {
  const haku = async () => {
    // hae tiedot
    const airtable_Kisatilastot = "appiKSPqfUYnu75OJ";
    const airtable_Kisatilastot_Perusta = "tblaT7eERmAgRsYKC";
    var tableData: AirtableResponse = await airtable_getTable(
      airtable_Kisatilastot,
      airtable_Kisatilastot_Perusta
    );

    console.log("tableData", tableData);
    if (tableData && tableData.records.length > 0) {
      fromAirtable = tableData;
    }
  };

  const asyncApu = async () => {
    await haku();
    console.log(" haettu, sitten sortteeraus");
    await rodeoBullResultsStudents();
    await rodeoAnkkaResultsStudents();
    await rodeoBullResultsArtists();

    refreshPage();
  };
  asyncApu();
};
