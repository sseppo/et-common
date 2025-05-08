import { WebflowClient } from "webflow-api";
import axios from "axios";
import {
  JotFormData,
  FormInfoContent,
  JotForm_Content,
  rankedResult,
  rankedList,
} from "./types/jotform_types";
import {
  sortBy,
  orderBy,
  getAnswerOf,
  sortByBestOf,
  arrangeByRank,
  prepareHTML,
} from "./tilastot_funktiot";
import { resultSeries } from "./tilastot_sarjat";

const refreshPage = () => {
  // Modal functionality
  //  document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".js-modal"),
    openModalBtn = document.querySelector(".js-show-modal"),
    closeModalBtns = document.querySelectorAll(".js-close-modal"),
    body = document.querySelector("body");

  const closeModal = () => {
    modal?.classList.remove("modal--opened");
    body?.classList.remove("overflowHidden");
    document.removeEventListener("keydown", handleEscClose);
  };

  const openModal = () => {
    modal?.classList.add("modal--opened");
    body?.classList.add("overflowHidden");
    document.addEventListener("keydown", handleEscClose);
  };

  const handleEscClose = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  if (modal) {
    openModalBtn?.addEventListener("click", openModal);
    closeModalBtns.forEach((btn) => btn.addEventListener("click", closeModal));
  }

  document.addEventListener("click", (event) => {
    if (
      modal?.classList.contains("modal--opened") &&
      !event.target?.closest(".modal__content") &&
      !event.target?.closest(".js-show-modal")
    ) {
      closeModal();
    }
  });
  //  });

  //  window.Webflow && window.Webflow.require("ix2").init();

  const event = new Event("refreshWS");
  document.dispatchEvent(event);
};

document.addEventListener("DOMContentLoaded", function () {
  var numberOfSubmissions = 0;
  var retreiveSubmissionsAmount = 0;
  var fromJotForm: JotForm_Content[] = [];

  var localhost = false;

  //var serverUrl = "http://localhost:5000";
  var serverUrl = "https://et-server-877cd73b3971.herokuapp.com";
  if (localhost) {
    serverUrl = "http://localhost:5000";
  }

  var hakuParametrit = {
    offset: 0,
    limit: 1000,
    filter: {
      //    sarja: "Opiskelija",
    },
    orderby: {
      //    sarja: "Opiskelija",
    },
  };

  const getFormInfo = async (formId) => {
    try {
      const axiosOptions = {
        method: "GET",
        url: serverUrl + "/jotform/form-info/" + formId,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      };
      const response = await axios(axiosOptions);

      //log("Form info response", response);
      if (response.status !== 200) {
        console.error("Error fetching tilastot data:", response.statusText);
        return;
      }

      const formInfoData: FormInfoContent = response.data.data.content;

      numberOfSubmissions = Number(formInfoData.count);
    } catch (error) {
      console.error("Error fetching tilastot data:", error);
    }
  };

  const getTilastot = async ({ offset, limit, filter, orderby }) => {
    const combinedTulokset = [];
    try {
      const urli = serverUrl + "/jotform/tilastot?hakuParametrit=" + JSON.stringify(hakuParametrit);
      //console.log("kysely lähtee, ", urli);
      const axiosOptions = {
        method: "GET",
        url: urli,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      };
      const response = await axios(axiosOptions);

      //      console.log("response", response);
      if (response.status !== 200) {
        console.error("Error fetching tilastot data:", response.statusText);
        return;
      }

      // Assuming the response data is in the expected format
      const tilastotData: JotFormData = response.data.data;
      //    console.log("Tilastot data:", tilastotData);

      const tuloksetRawObj = tilastotData.content;
      //  console.log("tuloksetRawObj", tuloksetRawObj);

      const tulolsetRawArr = [...Object.values(tuloksetRawObj)].flat();
      //console.log("tuloksetRawArray", tulolsetRawArr);

      fromJotForm = fromJotForm.concat(tulolsetRawArr);

      // console.log("tuloksetRArr tällä kiekalla", fromJotForm);

      // tarvittko hakea lisää? Sieltä kun tulee vain osa kerrallaan
      const resultSet = tilastotData.resultSet;
      retreiveSubmissionsAmount += resultSet.count;

      if (retreiveSubmissionsAmount < numberOfSubmissions) {
        hakuParametrit.offset = retreiveSubmissionsAmount;
        await getTilastot(hakuParametrit);
      }
    } catch (error) {
      console.error("Error fetching tilastot data:", error);
    }
  };
  const tilastoFormId = "251136488455059";

  const haku = async () => {
    // hae tiedot
    await getFormInfo(tilastoFormId);
    await getTilastot(hakuParametrit);
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
});

//console.log("tilastosivu2");
