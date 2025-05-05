import {
  JotFormData,
  FormInfoContent,
  JotForm_Content,
  rankedResult,
  rankedList,
} from "./types/jotform_types";

interface ResultSeries {
  lyhenne: string;
  insertAtDivId: string;
  rajaukset: {
    sarja: string;
    laji: string;
    montakoOli: string;
  };
  array: JotForm_Content[];
  sortBy?: {
    lyhenne: string;
    insertAtDivId: string;
    bestOf: string;
  }[];
}

export const resultSeries: ResultSeries[] = [
  {
    lyhenne: "o-r-n-1",
    insertAtDivId: "o-r-n-1",
    rajaukset: {
      sarja: "Opiskelija",
      laji: "Rodeohärkä - normaali",
      montakoOli: "1 - yksilösuoritus",
    },
    array: [],
    sortBy: [
      {
        lyhenne: "o-r-n-1-opintolinja",
        insertAtDivId: "o-r-n-1-opintolinja",
        bestOf: "opintolinja",
      },
    ],
  },
  {
    lyhenne: "o-r-r-1",
    insertAtDivId: "o-r-r-1",
    rajaukset: {
      sarja: "Opiskelija",
      laji: "Rodeohärkä - rahapalkinto",
      montakoOli: "1 - yksilösuoritus",
    },
    array: [],
  },
  {
    lyhenne: "o-a-n-1",
    insertAtDivId: "o-a-n-1",
    rajaukset: {
      sarja: "Opiskelija",
      laji: "Ankkarodeo - normaali",
      montakoOli: "1 - yksilösuoritus",
    },
    array: [],
  },
  {
    lyhenne: "o-a-r-1",
    insertAtDivId: "o-a-r-1",
    rajaukset: {
      sarja: "Opiskelija",
      laji: "Ankkarodeo - rahapalkinto",
      montakoOli: "1 - yksilösuoritus",
    },
    array: [],
  },
];
