import { WebflowClient } from "webflow-api";
import axios from "axios";
import { JotFormData, FormInfoContent, JotForm_Content } from "./types/jotform_types";
import { sortBy, orderBy, getAnswerOf, sortByBestOf } from "./tilastot_funktiot";

console.log("tilastosivu eka juttu2");

document.addEventListener("DOMContentLoaded", function () {
  var numberOfSubmissions = 0;
  var retreiveSubmissionsAmount = 0;
  const tuloksetRawObj = {};
  var tuloksetRArr: JotForm_Content[] = [];

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
        url: serverUrl + "/form-info/" + formId,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      };
      const response = await axios(axiosOptions);

      console.log("Form info response", response);
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
      console.log("kysely lähtee, ", urli);
      const axiosOptions = {
        method: "GET",
        url: urli,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      };
      const response = await axios(axiosOptions);

      console.log("response", response);
      if (response.status !== 200) {
        console.error("Error fetching tilastot data:", response.statusText);
        return;
      }

      // Assuming the response data is in the expected format
      const tilastotData: JotFormData = response.data.data;
      console.log("Tilastot data:", tilastotData);

      const tuloksetRawObj = tilastotData.content;
      console.log("tuloksetRawObj", tuloksetRawObj);

      const tulolsetRawArr = [...Object.values(tuloksetRawObj)].flat();
      console.log("tuloksetRawArray", tulolsetRawArr);

      tuloksetRArr = tuloksetRArr.concat(tulolsetRawArr);

      console.log("tuloksetRArr tällä kiekalla", tuloksetRArr);

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

  const sarjat = async () => {
    console.log("tuloksetRArr", tuloksetRArr);

    if (tuloksetRArr && tuloksetRArr.length > 0) {
      // järjestä sarjojen mukaan
      const sarja_Opiskelijat_RodeoHarka_1 = await sortBy({
        tuloksetRawArr: tuloksetRArr,
        rajaukset: {
          sarja: "Opiskelija",
          laji: "Rodeohärkä - normaali",
          montakoOli: "1 - yksilösuoritus",
        },
      });

      const sarja_Opiskelijat_Rodeo_Ankka_1 = await sortBy({
        tuloksetRawArr: tuloksetRArr,
        rajaukset: {
          sarja: "Opiskelija",
          laji: "Ankkarodeo - normaali",
          montakoOli: "1 - yksilösuoritus",
        },
      });
      //console.log("sarja_Opiskelijat_RodeoHarka_1", sarja_Opiskelijat_RodeoHarka_1);

      // aiemmmista riippuvat
      if (sarja_Opiskelijat_RodeoHarka_1) {
        console.log("opintiolinja sorttaukseen ", sarja_Opiskelijat_RodeoHarka_1);

        const sarja_Oppintolinja_RodeoHarka_1 = await sortByBestOf({
          tuloksetObjArray: sarja_Opiskelijat_RodeoHarka_1,
          bestOf: "opintolinja",
          orderDirection: "desc",
        });
        /*
        const sarja_Oppilaitokset_RodeoHarka_1 = await sortBy({
          tuloksetRawArr: tuloksetRArr,
          rajaukset: {
            sarja: "Opiskelija",
            laji: "Rodeohärkä - normaali",
            montakoOli: "1 - yksilösuoritus",
          },
        });

        */
        console.log("sarja_Oppintolinja_RodeoHarka_1", sarja_Oppintolinja_RodeoHarka_1);

        const sarja_Oppilaitos_RodeoHarka_1 = await sortByBestOf({
          tuloksetObjArray: sarja_Opiskelijat_RodeoHarka_1,
          bestOf: "oppilaitos",
          orderDirection: "desc",
        });

        console.log("sarja_Oppilaitos_RodeoHarka_1", sarja_Oppilaitos_RodeoHarka_1);

        const ordederedSarja_Opiskelijat_RodeoHarka_1 = await orderBy({
          filteredObjArray: sarja_Opiskelijat_RodeoHarka_1,
          orderBy: "tulosSekunteina",
          orderDirection: "desc",
        });

        console.log(
          "ordederedSarja_Opiskelijat_RodeoHarka_1",
          ordederedSarja_Opiskelijat_RodeoHarka_1
        );

        // tulosta sarjat
        if (ordederedSarja_Opiskelijat_RodeoHarka_1) {
          const testinappi = document.querySelector("#ankka-1");
          if (!testinappi) return;

          const lista = ordederedSarja_Opiskelijat_RodeoHarka_1;
          //const lista = [...Object.values(ordederedSarja_Opiskelijat_RodeoHarka_1)].flat();
          var contentToAdd = "";
          for (let i = 0; i < lista.length; i++) {
            const tulosSekunteina = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "tulosSekunteina",
            });

            const tekija = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "nimiTai",
            });

            const sijoitus = "<h6>" + (i + 1) + ". Sija, aika " + tulosSekunteina + " s</h6>";
            const nimi = "<p>" + tekija + "</p>";

            if (sijoitus !== undefined && nimi != undefined) {
              const tuloste = sijoitus + nimi;
              contentToAdd += tuloste;
            }
          }

          //          console.log("contentToAdd", contentToAdd);

          testinappi.innerHTML = contentToAdd;
        }

        if (sarja_Oppintolinja_RodeoHarka_1) {
          const paikkaSivulla = document.querySelector("#opintolinja-rh-1");
          if (!paikkaSivulla) return;

          const lista = sarja_Oppintolinja_RodeoHarka_1;

          console.log("lista ennen tulostusta", lista);
          //const lista = [...Object.values(ordederedSarja_Opiskelijat_RodeoHarka_1)].flat();
          var contentToAdd = "";
          for (let i = 0; i < lista.length; i++) {
            console.log("lista[i].answers", lista[i].answers);
            const tulosSekunteina = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "tulosSekunteina",
            });

            const tekija = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "nimiTai",
            });

            const opintiolinja = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "opintolinja",
            });

            const sijoitus = "<h6>" + (i + 1) + ". Sija, aika " + tulosSekunteina + " s</h6>";
            const nimi =
              "<p>" + opintiolinja + "<BR /><span class='pienifontti'>" + tekija + "</span></p>";

            if (sijoitus !== undefined && nimi != undefined) {
              const tuloste = sijoitus + nimi;
              contentToAdd += tuloste;
            }
          }

          //  console.log("contentToAdd", contentToAdd);

          paikkaSivulla.innerHTML = contentToAdd;
        }

        if (sarja_Oppilaitos_RodeoHarka_1) {
          const paikkaSivulla = document.querySelector("#oppilaitos-rh-1");
          if (!paikkaSivulla) return;

          const lista = sarja_Oppilaitos_RodeoHarka_1;

          console.log("lista ennen tulostusta", lista);
          //const lista = [...Object.values(ordederedSarja_Opiskelijat_RodeoHarka_1)].flat();
          var contentToAdd = "";
          for (let i = 0; i < lista.length; i++) {
            console.log("lista[i].answers", lista[i].answers);
            const tulosSekunteina = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "tulosSekunteina",
            });

            const tekija = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "nimiTai",
            });

            const oppilaitos = await getAnswerOf({
              answers: lista[i].answers,
              answerOf: "oppilaitos",
            });

            const sijoitus = "<h6>" + (i + 1) + ". Sija, aika " + tulosSekunteina + " s</h6>";
            const nimi =
              "<p>" +
              oppilaitos +
              "<BR /><span class='tilastot-pienifontti'>" +
              tekija +
              "</span></p>";

            if (sijoitus !== undefined && nimi != undefined) {
              const tuloste = sijoitus + nimi;
              contentToAdd += tuloste;
            }
          }

          //  console.log("contentToAdd", contentToAdd);

          paikkaSivulla.innerHTML = contentToAdd;
        }
      }
    }
  };

  const asyncApu = async () => {
    await haku();
    await sarjat();
  };
  asyncApu();
});
console.log("tilastosivu2");
