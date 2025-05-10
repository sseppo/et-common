import { WebflowClient } from "webflow-api";

import {
  JotFormData,
  FormInfoContent,
  JotForm_Content,
  rankedResult,
  rankedList,
} from "../../types/jotform_types";
import {
  sortBy,
  orderBy,
  getAnswerOf,
  sortByBestOf,
  arrangeByRank,
  prepareHTML,
} from "./jotform_tilastot_funktiot";
import { resultSeries } from "../../tilastot_sarjat";
import { jotform_getFormInfo, jotform_getTilastot, jotform_getRawData } from "./jotform_database";
import { serverData } from "../../server";

var fromJotForm: JotForm_Content[] = [];

export const infoFromJotForm = async () => {
  //document.addEventListener("DOMContentLoaded", function () {
  const haku = async () => {
    // hae tiedot
    var formData = await jotform_getRawData("251136488455059"); // tilastot

    if (formData && formData.length > 0) {
      fromJotForm = formData;
    }
    //await jotform_getFormInfo(tilastoFormId);
    // await jotform_getTilastot(hakuParametrit);
  };

  const tulostaSivuille = async (
    list: JotForm_Content[],
    placement: string,
    printStyle: string
  ) => {
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
    const suorittajiaYksi = async () => {
      // Rodeohärkä, Opiskelija, 1 - yksilösuoritus
      const resultIndex = resultSeries.findIndex((s) => s.lyhenne === "o-r-n-1");
      const sarja = resultSeries[resultIndex];
      if (!sarja) return;
      const sarjaObj = await sortBy({
        tuloksetRawArr: fromJotForm,
        rajaukset: {
          sarja: "Opiskelija",
          laji: "Rodeohärkä - normaali",
          montakoOli: "1 - yksilösuoritus",
        },
      });

      if (sarjaObj) {
        resultSeries[resultIndex].array = sarjaObj;

        const opintolinjat = await sortByBestOf({
          tuloksetObjArray: sarjaObj,
          bestOf: "opintolinja",
          orderDirection: "desc",
        });

        const oppilaitokset = await sortByBestOf({
          tuloksetObjArray: sarjaObj,
          bestOf: "oppilaitos",
          orderDirection: "desc",
        });

        const opiskelijat = await sortByBestOf({
          tuloksetObjArray: sarjaObj,
          bestOf: "tulosSekunteina",
          orderDirection: "desc",
        });

        // tulosta sarjat
        if (opiskelijat) {
          tulostaSivuille(opiskelijat, "o-r-n-1", "style-1");
        }
        if (oppilaitokset) {
          tulostaSivuille(oppilaitokset, "oppilaitos-rh-1", "style-2");
        }
        if (opintolinjat) {
          tulostaSivuille(opintolinjat, "opintolinja-rh-1", "style-3");
        }
      }
    };
    const suorittajiaKaksi = async () => {
      // Rdeohärkä, Opiskelija, 2 - 2 päällä!
      const sarjaObj2 = await sortBy({
        tuloksetRawArr: fromJotForm,
        rajaukset: {
          sarja: "Opiskelija",
          laji: "Rodeohärkä - normaali",
          montakoOli: "2 - 2 päällä!",
        },
      });
      if (sarjaObj2) {
        const opiskelijat2 = await sortByBestOf({
          tuloksetObjArray: sarjaObj2,
          bestOf: "tulosSekunteina",
          orderDirection: "desc",
        });
        const oppilaitokset2 = await sortByBestOf({
          tuloksetObjArray: sarjaObj2,
          bestOf: "oppilaitos",
          orderDirection: "desc",
        });
        const opintolinjat2 = await sortByBestOf({
          tuloksetObjArray: sarjaObj2,
          bestOf: "opintolinja",
          orderDirection: "desc",
        });

        // tulosta sarjat
        if (opiskelijat2) {
          tulostaSivuille(opiskelijat2, "o-r-n-2", "style-1");
        }
        if (oppilaitokset2) {
          tulostaSivuille(oppilaitokset2, "oppilaitos-rh-2", "style-2");
        }
        if (opintolinjat2) {
          tulostaSivuille(opintolinjat2, "opintolinja-rh-2", "style-3");
        }
      }
    };

    const suorittajiaKolme = async () => {
      // Rodeohärkä, Opiskelija, 3 - 3 päällä!
      const sarjaObj3 = await sortBy({
        tuloksetRawArr: fromJotForm,
        rajaukset: {
          sarja: "Opiskelija",
          laji: "Rodeohärkä - normaali",
          montakoOli: "3 - 3 päällä!",
        },
      });
      if (sarjaObj3) {
        const opiskelijat3 = await sortByBestOf({
          tuloksetObjArray: sarjaObj3,
          bestOf: "tulosSekunteina",
          orderDirection: "desc",
        });
        const oppilaitokset3 = await sortByBestOf({
          tuloksetObjArray: sarjaObj3,
          bestOf: "oppilaitos",
          orderDirection: "desc",
        });
        const opintolinjat3 = await sortByBestOf({
          tuloksetObjArray: sarjaObj3,
          bestOf: "opintolinja",
          orderDirection: "desc",
        });

        // tulosta sarjat
        if (opiskelijat3) {
          tulostaSivuille(opiskelijat3, "o-r-n-3", "style-1");
        }
        if (oppilaitokset3) {
          tulostaSivuille(oppilaitokset3, "oppilaitos-rh-3", "style-2");
        }
        if (opintolinjat3) {
          tulostaSivuille(opintolinjat3, "opintolinja-rh-3", "style-3");
        }
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
    // console.log("---------------> rodeoAnkkaResults");
    // Ankkarodeo, Opiskelija, 1 - yksilösuoritus
    const resultIndex = resultSeries.findIndex((s) => s.lyhenne === "o-a-n-1");
    const sarja = resultSeries[resultIndex];
    // console.log("resultIndex", resultIndex);
    // console.log("sarja", sarja);
    if (!sarja) return;
    const sarjaObj = await sortBy({
      tuloksetRawArr: fromJotForm,
      rajaukset: {
        sarja: "Opiskelija",
        laji: "Ankkarodeo - normaali",
        montakoOli: "1 - yksilösuoritus",
      },
    });

    //console.log("sarjaObj", sarjaObj);
    if (sarjaObj) {
      resultSeries[resultIndex].array = sarjaObj;
      const opintolinjat = await sortByBestOf({
        tuloksetObjArray: sarjaObj,
        bestOf: "opintolinja",
        orderDirection: "desc",
      });
      const oppilaitokset = await sortByBestOf({
        tuloksetObjArray: sarjaObj,
        bestOf: "oppilaitos",
        orderDirection: "desc",
      });
      const opiskelijat = await sortByBestOf({
        tuloksetObjArray: sarjaObj,
        bestOf: "tulosSekunteina",
        orderDirection: "desc",
      });
      // tulosta sarjat
      if (opiskelijat) {
        tulostaSivuille(opiskelijat, "o-a-n-1", "style-1");
      }
      if (oppilaitokset) {
        tulostaSivuille(oppilaitokset, "oppilaitos-a-1", "style-2");
      }
      if (opintolinjat) {
        tulostaSivuille(opintolinjat, "opintolinja-a-1", "style-3");
      }
    }

    // Ankkarodeo, Opiskelija, 2 - 2 päällä!
    const sarjaObj2 = await sortBy({
      tuloksetRawArr: fromJotForm,
      rajaukset: {
        sarja: "Opiskelija",
        laji: "Ankkarodeo - normaali",
        montakoOli: "2 - 2 päällä!",
      },
    });
    if (sarjaObj2) {
      const opiskelijat2 = await sortByBestOf({
        tuloksetObjArray: sarjaObj2,
        bestOf: "tulosSekunteina",
        orderDirection: "desc",
      });
      const oppilaitokset2 = await sortByBestOf({
        tuloksetObjArray: sarjaObj2,
        bestOf: "oppilaitos",
        orderDirection: "desc",
      });
      const opintolinjat2 = await sortByBestOf({
        tuloksetObjArray: sarjaObj2,
        bestOf: "opintolinja",
        orderDirection: "desc",
      });

      // tulosta sarjat
      if (opiskelijat2) {
        tulostaSivuille(opiskelijat2, "o-a-n-2", "style-1");
      }
      if (oppilaitokset2) {
        tulostaSivuille(oppilaitokset2, "oppilaitos-a-2", "style-2");
      }
      if (opintolinjat2) {
        tulostaSivuille(opintolinjat2, "opintolinja-a-2", "style-3");
      }
    }
  };

  const rodeoBullResultsArtists = async () => {
    // Rodeohärkä, Artisti, 1 - yksilösuoritus
    const sarjaObj = await sortBy({
      tuloksetRawArr: fromJotForm,
      rajaukset: {
        sarja: "Artisti",
        laji: "Rodeohärkä - normaali",
        montakoOli: "1 - yksilösuoritus",
      },
    });

    if (sarjaObj) {
      const artistit = await sortByBestOf({
        tuloksetObjArray: sarjaObj,
        bestOf: "tulosSekunteina",
        orderDirection: "desc",
      });

      // tulosta sarjat
      if (artistit) {
        tulostaSivuille(artistit, "a-r-n-1", "style-1");
      }
    }
  };

  const asyncApu = async () => {
    await haku();
    //    await sarjat();
    console.log(" haettu, sitten sortteeraus");
    await rodeoBullResultsStudents();
    await rodeoAnkkaResultsStudents();
    await rodeoBullResultsArtists();

    // await refreshPage();
    //window.Webflow && window.Webflow.require("ix2").init();
  };
  asyncApu();
  //});
};
//console.log("tilastosivu2");
