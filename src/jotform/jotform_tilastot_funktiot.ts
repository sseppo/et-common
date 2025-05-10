import { WebflowClient } from "webflow-api";
import axios from "axios";
import {
  JotForm_Content,
  Vastaukset,
  tulosKentat,
  sarjat,
  lajit,
  sukupuolet,
  montakoOli,
  rankedResult,
  rankedList,
} from "../../types/jotform_types";
import { openModal } from "../../turhat/modal";

interface sortParams {
  tuloksetRawArr: JotForm_Content[];
  rajaukset: Object;
}
// TODO: muuta any niin että vastaan aidosti formin tuloksia

interface orderParams {
  filteredObjArray: JotForm_Content[];
  orderBy: tulosKentat | string;
  orderDirection: "asc" | "desc";
}

interface bestOfParams {
  tuloksetObjArray: JotForm_Content[];
  bestOf: tulosKentat | string;
  orderDirection: "asc" | "desc";
}

interface filterList {
  toBeFilteredObjArray: JotForm_Content[];
  byField: string;
  byValue: string | number;
}

interface answerParams {
  answers: {
    [key: number]: Vastaukset[];
  };
  answerOf: string;
}

interface answerParamsShort {
  answers: {
    [key: number]: Vastaukset[];
  };
}
interface bestFilteri {
  filteri: string | sarjat[] | lajit[] | sukupuolet[] | montakoOli[];
  tulos: number;
  formObj: JotForm_Content;
}

const placeImgsrc = (imgsrc: string) => {
  var modalImg = document.querySelector("#modal-image") as HTMLImageElement;
  modalImg.src = imgsrc;
};

const resetWF = async () => {
  window.Webflow && window.Webflow.require("ix2").init();
};

const openImgModal = (imgsrc: string) => {
  var modal = document.getElementById("modal-wrapper");
  if (!modal) return;
  modal.showModal();
};

export const sortBy = async (parametrit: sortParams) => {
  try {
    const { tuloksetRawArr, rajaukset } = parametrit;

    // Flatten the array of arrays into a single array
    const flattenedArray = tuloksetRawArr.flat();

    // Filter the flattened array based on the rajaukset criteria
    const filteredArray = flattenedArray.filter((item) =>
      Object.entries(rajaukset).every(([key, value]) => {
        const vastauksetRawArr = [...Object.values(item.answers)].flat();

        const vastauksetEka = vastauksetRawArr.find((answerRaw: Vastaukset) => {
          if (answerRaw.name === key) {
            if (key === "sarja" || key === "sukupuoli") {
              if (Array.isArray(answerRaw.answer)) {
                return answerRaw.answer.some((ans: string) => ans === value);
              } else {
                return false;
              }
            } else {
              if (answerRaw.answer === value) {
                // tänne tulee myös || key === "laji"  ja || key === "montakoOli"
                return true;
              } else {
                return false;
              }
            }
          }
        });
        return vastauksetEka;
        // return vastauksetEka && vastauksetEka.text === value;
      })
    );

    return filteredArray;
  } catch (error) {
    console.error("Error in sortBy function:", error);
    return null;
  }
};

export const orderBy = async (orderParams: orderParams) => {
  try {
    const { filteredObjArray, orderBy, orderDirection } = orderParams;

    // Sort the filtered array based on the specified field and direction
    const sortedArray = filteredObjArray.sort((a, b) => {
      const aAnswers = [...Object.values(a.answers)].flat();
      const bAnswers = [...Object.values(b.answers)].flat();
      const aAnswer = aAnswers.find((answer: Vastaukset) => answer.name === orderBy);
      const bAnswer = bAnswers.find((answer: Vastaukset) => answer.name === orderBy);

      const aValue = aAnswers.find((answer: Vastaukset) => answer.name === orderBy)?.answer;
      const bValue = bAnswers.find((answer: Vastaukset) => answer.name === orderBy)?.answer;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return orderDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return 0; // If values are not comparable, keep original order
      }
    });

    return sortedArray;
  } catch (error) {
    console.error("Error in orderBy function:", error);
    return null;
  }
};

export const getAnswerOf = async (answerParams: answerParams) => {
  try {
    const { answers, answerOf } = answerParams;

    const vastaukset = [...Object.values(answers)].flat();

    const vastauksetEka = vastaukset.find((answerRaw: Vastaukset) => {
      if (answerRaw.name === answerOf) {
        return answerRaw.answer;
      }
    });
    return vastauksetEka ? vastauksetEka.answer : null;
  } catch (error) {
    console.error("Error in getAnswerOf function:", error);
  }
  return null;
};

export const getString = async (answerOf: string, answers: { [key: number]: Vastaukset[] }) => {
  try {
    var name = await getAnswerOf({
      answers: answers,
      answerOf: answerOf,
    });

    if (name === undefined || name === null) {
      return "Not Defined";
    } else {
      return String(name);
    }
  } catch (error) {
    console.error("Error in getAnswerOf function:", error);
  }
  return "Not Defined";
};

export const getNumber = async (answerOf: string, answers: { [key: number]: Vastaukset[] }) => {
  try {
    var name = await getAnswerOf({
      answers: answers,
      answerOf: answerOf,
    });

    if (name === undefined || name === null) {
      return -1;
    } else {
      return Number(name);
    }
  } catch (error) {
    console.error("Error in getAnswerOf function:", error);
  }
  return -1;
};

export const getSchool = async (answers: { [key: number]: Vastaukset[] }) => {
  var name = await getString("oppilaitos", answers);
  return name;
};

export const getStudylane = async (answers: { [key: number]: Vastaukset[] }) => {
  var name = await getString("opintolinja", answers);
  return name;
};

export const getImageUrl = async (answers: { [key: number]: Vastaukset[] }) => {
  var name = await getString("typeA", answers);
  return name;
};

export const getWorkplace = async (answers: { [key: number]: Vastaukset[] }) => {
  var name = await getString("tyopaikka", answers);
  return name;
};

export const getEventName = async (answers: { [key: number]: Vastaukset[] }) => {
  var name = await getString("tapahtumanNimi", answers);
  return name;
};

export const getName = async (answers: { [key: number]: Vastaukset[] }) => {
  var name = await getString("nimiTai", answers);
  return name;
};

export const getRecord = async (answers: { [key: number]: Vastaukset[] }) => {
  var number = await getNumber("tulosSekunteina", answers);
  return number;
};

export const sortByBestOf = async (bestOfParams: bestOfParams) => {
  try {
    const { tuloksetObjArray, bestOf, orderDirection } = bestOfParams;

    const filteredArr: bestFilteri[] = [];

    for (const [key, value] of Object.entries(tuloksetObjArray)) {
      //const vastauksetRawArr = [...Object.values(value.answers)].flat();

      const filterByValue = await getAnswerOf({ answers: value.answers, answerOf: bestOf });
      const bestOfvalue = Number(
        await getAnswerOf({ answers: value.answers, answerOf: "tulosSekunteina" })
      );

      // console.log("filteredArr ennen lisäyksiä", filteredArr);
      // console.log("filterByValue", filterByValue);
      // console.log("bestOfvalue", bestOfvalue);

      if (!filterByValue && !bestOfvalue) {
        // console.log("ei löytynyt tulsota vaadittuja arvoja, ei lisätä");
        continue;
      }
      const existingEntry = filteredArr.find((entry: any) => entry.filteri === filterByValue);

      if (existingEntry === undefined) {
        //  console.log("ei löytynyt, lisätään uusi");
        if (filterByValue && bestOfvalue) {
          filteredArr.push({
            filteri: filterByValue,
            tulos: bestOfvalue,
            formObj: value,
          });
        }
        /*
        formObj: {
            [key]: value,
          },
          */
      } else {
        //console.log("löydettiin, päivitetään tulos");
        if (orderDirection === "asc") {
          if (bestOfvalue < existingEntry.tulos) {
            existingEntry.tulos = bestOfvalue;
            existingEntry.formObj = value;
          }
        } else {
          if (bestOfvalue > existingEntry.tulos) {
            existingEntry.tulos = bestOfvalue;
            existingEntry.formObj = value;
          }
        }
      }
      //console.log("filteredArr tsekkausten jälkeen ", filteredArr);
    }

    const sortedArr = filteredArr.sort((a: any, b: any) => {
      if (orderDirection === "asc") {
        return a.tulos - b.tulos;
      } else {
        return b.tulos - a.tulos;
      }
    });

    var sortedObjArr: JotForm_Content[] = [];
    for (let i = 0; i < sortedArr.length; i++) {
      sortedObjArr.push(sortedArr[i].formObj);
    }

    return sortedObjArr;
  } catch (error) {
    console.error("Error in getAnswerOf function:", error);
  }
  return null;
};

export const getAllByAnswerValue = async (params: filterList) => {
  try {
    const { toBeFilteredObjArray, byField, byValue } = params;

    const filteredArray = toBeFilteredObjArray.filter((item) => {
      const answers = [...Object.values(item.answers)].flat();
      const answer = answers.find((answerRaw: Vastaukset) => answerRaw.name === byField);

      return answer && answer.answer === String(byValue);
    });

    return filteredArray;
  } catch (error) {
    console.error("Error in getAllByAnswer function:", error);
  }
  return null;
};

export const arrangeByRank = async (tuloksetObjArray: JotForm_Content[]) => {
  const rankedArray: rankedResult[] = [];
  const rankedList: rankedList = {
    nrOfRanks: 0,
    nrOfResults: 0,
    results: [],
    insertAtDivId: "",
    referenceId: "",
    modifiedAt: new Date(),
  };

  try {
    const sortedArray = await orderBy({
      filteredObjArray: tuloksetObjArray,
      orderBy: "tulosSekunteina",
      orderDirection: "desc",
    });

    if (!sortedArray) {
      console.error("sortedArray is null or undefined");
      return null;
    }

    let currentRank = 1;

    for (let i = 0; i < sortedArray.length; i++) {
      const tulosSekunteina = await getRecord(sortedArray[i].answers);

      if (tulosSekunteina === undefined || tulosSekunteina === null) {
        return null;
      }

      const similarRanks = await getAllByAnswerValue({
        toBeFilteredObjArray: sortedArray,
        byField: "tulosSekunteina",
        byValue: tulosSekunteina,
      });
      if (!similarRanks || similarRanks.length === 0) {
        return null;
      }
      const nrOfOthersAtSameRank = similarRanks.length;

      for (let j = 0; j < similarRanks.length; j++) {
        const tulos = await getRecord(sortedArray[i + j].answers);
        const person = await getName(sortedArray[i + j].answers);
        const school = await getSchool(sortedArray[i + j].answers);
        const venue = await getWorkplace(sortedArray[i + j].answers);
        const eventName = await getEventName(sortedArray[i + j].answers);
        const institute = school || venue;

        rankedArray.push({
          rank: currentRank,
          nrOfOthersAtSameRank: nrOfOthersAtSameRank,
          record: tulos,
          byPerson: person,
          byInstitute: String(institute),
          at: String(eventName),
          tulos: sortedArray[i + j],
        });
      }
      currentRank++;
      i += nrOfOthersAtSameRank - 1; // Skip the next entries with the same rank
    }

    rankedList.results = rankedArray;
    rankedList.nrOfRanks = currentRank;
    rankedList.nrOfResults = rankedArray.length;
    rankedList.insertAtDivId = "";
    rankedList.referenceId = "";
    rankedList.modifiedAt = new Date();

    return rankedList;
  } catch (error) {
    console.error("Error in arrangeByRank function:", error);
  }
  return null;
};

export const prepareHTML = async (rankedList: rankedList, printStyle: string) => {
  try {
    const { results, nrOfRanks, nrOfResults } = rankedList;

    let contentToAdd = "";

    const preInfo = "<p>Tuloksia tilastoitu: " + nrOfResults + "</p>";

    for (let i = 0; i < results.length; i++) {
      const tulosSekunteina = results[i].record;

      var jaettuSija = " ";
      if (results[i].nrOfOthersAtSameRank > 1) {
        jaettuSija = " (Jaettu) ";
      }

      const rankHeader =
        "<h6>" + results[i].rank + ". Sija" + jaettuSija + ", aika " + tulosSekunteina + " s</h6>";

      var paragraphsAtRank = "";
      var imageCode = "";
      var imageButtonCode = "";
      var imageStart = "";
      var imageEnd = "";
      var imageMiddle = "";

      for (let j = 0; j < results[i].nrOfOthersAtSameRank; j++) {
        const tekija = results[i + j].byPerson;
        const eventName = results[i + j].at || "";
        const institute = results[i + j].byInstitute || "";
        const imageUrl = await getImageUrl(results[i + j].tulos.answers);

        imageCode = "";
        imageButtonCode = "";
        imageStart = "";
        imageEnd = "";
        imageMiddle = "";
        if (imageUrl !== "" && imageUrl !== "Not Defined") {
          //imageCode = "<img src='" + imageUrl + "' class='tuuletuskuva-pieni' />";
          /*
          imageButtonCode =
            "<button class='tuuletuskuva-pieni js-show-modal button js-show-modal' type='button' onclick='placeImgsrc2(\"" +
            imageUrl +
            "\"); '>Kuva</button>";
            */
          /*        
          imageButtonCode =
            "<a href=\"#modal-wrapper\" class='tuuletuskuva-pieni' type='button' onclick='placeImgsrc2(\"" +
            imageUrl +
            "\"); '>Katso Kuva</a>";
*/
          imageButtonCode =
            '<BR /><a href="' + imageUrl + "\" type='button' target='_blank'> Katso Kuva</a>";

          imageStart = "<div class='tulos-kuvalla'><div class='tulos'>";

          imageMiddle = "</div>";
          imageEnd = "</div>";

          //          var modalImg = document.querySelector("#modal-image") as HTMLImageElement;
          //         modalImg.src = imageUrl;
        }

        var className = "";
        if (j % 2 === 0) {
          className = " class='parillisetrivit'";
        }

        if (printStyle === "style-1") {
          // nimi ja koulu yläriville, paikka alarville
          var startParagraph = "<p" + className + ">";
          var firstRow = tekija;

          if (institute !== "" && institute !== "Not Defined") {
            firstRow += ", " + institute;
          }

          var secondRow = "";
          if (eventName !== "" && eventName !== "Not Defined") {
            secondRow +=
              "<BR /><span class='tilastot-pienifontti'>At " +
              eventName +
              imageButtonCode +
              "</span>";
          }

          paragraphsAtRank += startParagraph + firstRow + secondRow + "</p>";
        } else if (printStyle === "style-2") {
          if (institute !== "") {
            // oppilaitos yläriville, nimi alariville
            var startParagraph = "<p" + className + ">";
            var firstRow = institute;

            var secondRow = "";
            var lisays = "";
            if (eventName !== "" && eventName !== "Not Defined") {
              lisays = " at " + eventName;
            }
            secondRow +=
              "<BR /><span class='tilastot-pienifontti'>By " + tekija + lisays + "</span>";

            paragraphsAtRank += startParagraph + firstRow + secondRow + "</p>";
          }
        } else if (printStyle === "style-3") {
          // opintolija yläriville, muut alarville

          const opintolinja = (await getStudylane(results[i + j].tulos.answers)) || "";
          if (opintolinja !== "") {
            var startParagraph = "<p" + className + ">";
            var firstRow = opintolinja;

            if (institute !== "" && institute !== "Not Defined") {
              firstRow += ", " + institute;
            }

            var secondRow = "";
            var lisays = "";
            if (eventName !== "" && eventName !== "Not Defined") {
              lisays = " at " + eventName;
            }
            secondRow +=
              "<BR /><span class='tilastot-pienifontti'>By " + tekija + lisays + "</span>";

            paragraphsAtRank += startParagraph + firstRow + secondRow + "</p>";
          }
        }
      }
      i = i + results[i].nrOfOthersAtSameRank - 1; // Skip the next entries with the same rank

      if (rankHeader !== undefined && paragraphsAtRank != "") {
        const tuloste = imageStart + rankHeader + paragraphsAtRank + imageMiddle + imageEnd;

        //          imageStart + rankHeader + paragraphsAtRank + imageMiddle + imageButtonCode + imageEnd;
        //imageStart + rankHeader + paragraphsAtRank + imageMiddle + imageButtonCode + imageEnd;
        contentToAdd += tuloste;
      }
    }

    contentToAdd = preInfo + contentToAdd;

    return contentToAdd;
  } catch (error) {
    console.error("Error in prepareHTML function:", error);
  }
  return null;
};
