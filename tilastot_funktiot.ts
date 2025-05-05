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
} from "./types/jotform_types";
import { object } from "webflow-api/core/schemas";

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

interface answerParams {
  answers: {
    [key: number]: Vastaukset[];
  };
  answerOf: string;
}

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
    console.log("filteredArray", filteredArray);

    return filteredArray;
  } catch (error) {
    console.error("Error in sortBy function:", error);
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

    console.log("sortedArray", sortedArray);

    return sortedArray;
  } catch (error) {
    console.error("Error in orderBy function:", error);
  }
};

export const getAnswerOf = async (answerParams: answerParams) => {
  try {
    const { answers, answerOf } = answerParams;

    const vastaukset = [...Object.values(answers)].flat();

    //console.log("etsutään vastauksia", answerOf, vastaukset);
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

interface bestFilteri {
  filteri: string | sarjat[] | lajit[] | sukupuolet[] | montakoOli[];
  tulos: number;
  formObj: JotForm_Content;
}

export const sortByBestOf = async (bestOfParams: bestOfParams) => {
  try {
    console.log("--- sortByBestOf");
    const { tuloksetObjArray, bestOf, orderDirection } = bestOfParams;

    const filteredArr: bestFilteri[] = [];

    for (const [key, value] of Object.entries(tuloksetObjArray)) {
      //const vastauksetRawArr = [...Object.values(value.answers)].flat();

      const filterByValue = await getAnswerOf({ answers: value.answers, answerOf: bestOf });
      const bestOfvalue = Number(
        await getAnswerOf({ answers: value.answers, answerOf: "tulosSekunteina" })
      );

      console.log("filteredArr ennen lisäyksiä", filteredArr);
      console.log("filterByValue", filterByValue);
      console.log("bestOfvalue", bestOfvalue);

      if (!filterByValue && !bestOfvalue) {
        console.log("ei löytynyt tulsota vaadittuja arvoja, ei lisätä");
        continue;
      }
      const existingEntry = filteredArr.find((entry: any) => entry.filteri === filterByValue);

      console.log("existingEntry", existingEntry);
      if (existingEntry === undefined) {
        console.log("ei löytynyt, lisätään uusi");
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
        console.log("löydettiin, päivitetään tulos");
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
      console.log("filteredArr tsekkausten jälkeen ", filteredArr);
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

console.log("tilastosivu2");
