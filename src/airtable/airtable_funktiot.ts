import {
  airtable_Kisatilastot_Perusta,
  AirtableRecord,
  rankedList,
  rankedResult,
  tulosKentat,
} from "../../types/airtable_types";

interface orderParams {
  filteredObjArray: AirtableRecord[];
  orderBy: tulosKentat | string;
  orderDirection: "asc" | "desc";
}

interface filterList {
  toBeFilteredObjArray: AirtableRecord[];
  byField: string;
  byValue: string | number;
}

interface bestFilteri {
  filteri: string | number | any[];
  tulos: string | number | any[];
  formObj: AirtableRecord;
}
/*
export const sortBy = async (tuloksetRawArr: AirtableRecord[], rajaukset: Object) => {
  try {
    //const { tuloksetRawArr, rajaukset } = parametrit;

    // Flatten the array of arrays into a single array
    const flattenedArray = tuloksetRawArr.flat();

    // Filter the flattened array based on the rajaukset criteria
    const filteredArray = flattenedArray.filter((item) =>
      Object.entries(rajaukset).every(([key, value]) => {
        const vastauksetRawArr = [...Object.values(item.fields)].flat();

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
*/

const getFieldValue = async (fields: airtable_Kisatilastot_Perusta, fieldName: string) => {
  try {
    //console.log("getFieldValue", fields, fieldName);
    if (fields && fields.hasOwnProperty(fieldName)) {
      const fieldValue = fields[fieldName];
      if (Array.isArray(fieldValue)) {
        // return fieldValue[0]; // Return the first value in the array
        return fieldValue;
      } else if (typeof fieldValue === "string" || typeof fieldValue === "number") {
        return fieldValue;
      } else {
        console.error(`Field "${fieldName}" has an unsupported type.`);
        return null;
      }
    } else {
      // console.error(`Field "${fieldName}" not found in record.`);
      return null;
    }
  } catch (error) {
    console.error("Error in getFieldValue function:", error);
    return null;
  }
};

export const getTopResults = async (records: AirtableRecord[]) => {
  if (records && records.length > 0) {
    const sortedRecords = records.sort((a, b) => {
      const aScore = a.fields["Tulos, sekunteina"] || 0;
      const bScore = b.fields["Tulos, sekunteina"] || 0;
      return bScore - aScore; // Sort in descending order
    });
    const topRecords = sortedRecords.slice(0, 10); // Get top 10 records
    const resultList = topRecords.map((record) => ({
      name: record.fields["Nimi tai nimimerkki"],
      score: record.fields["Tulos, sekunteina"],
      rank: sortedRecords.indexOf(record) + 1,
      result: record.fields,
    }));
    return resultList;
  } else {
    console.log("No records found in Airtable.");
    return [];
  }
};

export const filterByRecordValue = async (
  records: AirtableRecord[],
  byField: string,
  byValue: string | number | any[]
) => {
  try {
    if (!records || records.length === 0) {
      console.error("No records found.");
      return [];
    }
    const filteredArray = records.filter((item) => {
      const fields = Object.keys(item.fields);
      const field = fields.find((field) => field === byField);
      if (!field) {
        console.error(`Field "${byField}" not found in record.`);
        return false;
      }
      const fieldValue = item.fields[field];
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((value) => value === byValue);
      } else if (typeof fieldValue === "string" || typeof fieldValue === "number") {
        return fieldValue === byValue;
      } else {
        console.error(`Field "${byField}" has an unsupported type.`);
        return false;
      }
    });
    if (filteredArray && filteredArray.length > 0) {
      return filteredArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in filterByRecordValue function:", error);
    return [];
  }
};

export const filterByMultipleRecordValues = async (records: AirtableRecord[], filters: Object) => {
  try {
    if (!records || records.length === 0) {
      console.error("No records found.");
      return [];
    }
    const filteredArray = records.filter((item) => {
      const fields = Object.keys(item.fields);
      return Object.entries(filters).every(([key, value]) => {
        const field = fields.find((field) => field === key);
        if (!field) {
          console.error(`Field "${key}" not found in record.`);
          return false;
        }
        const fieldValue = item.fields[field];
        if (Array.isArray(fieldValue)) {
          //         var temp = fieldValue.some((val) => val === value);

          return fieldValue.some((val) => val === value);
        } else if (typeof fieldValue === "string" || typeof fieldValue === "number") {
          return fieldValue === value;
        } else {
          console.error(`Field "${key}" has an unsupported type.`);
          return false;
        }
      });
    });
    if (filteredArray && filteredArray.length > 0) {
      return filteredArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in filterByMultipleRecordValues function:", error);
    return [];
  }
};

export const sortByBestOf = async (
  records: AirtableRecord[],
  bestOf: string,
  orderDirection: "asc" | "desc"
) => {
  try {
    const filteredArr: bestFilteri[] = [];

    for (const [key, value] of Object.entries(records)) {
      const filterByValue = await getFieldValue(value.fields, bestOf);
      const bestOfvalue = await getFieldValue(value.fields, "Tulos, sekunteina");

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
      } else {
        //console.log("löydettiin, päivitetään tulos");
        if (orderDirection === "asc") {
          if (bestOfvalue && bestOfvalue < existingEntry.tulos) {
            existingEntry.tulos = bestOfvalue;
            existingEntry.formObj = value;
          }
        } else {
          if (bestOfvalue && bestOfvalue > existingEntry.tulos) {
            existingEntry.tulos = bestOfvalue;
            existingEntry.formObj = value;
          }
        }
      }
    }

    const sortedArr = filteredArr.sort((a: any, b: any) => {
      if (orderDirection === "asc") {
        return a.tulos - b.tulos;
      } else {
        return b.tulos - a.tulos;
      }
    });

    var sortedObjArr: AirtableRecord[] = [];
    for (let i = 0; i < sortedArr.length; i++) {
      sortedObjArr.push(sortedArr[i].formObj);
    }

    return sortedObjArr;
  } catch (error) {
    console.error("Error in getAnswerOf function:", error);
  }
  return null;
};

export const orderBy = async (orderParams: orderParams) => {
  try {
    const { filteredObjArray, orderBy, orderDirection } = orderParams;

    // Sort the filtered array based on the specified field and direction
    const sortedArray = filteredObjArray.sort((a, b) => {
      const aValue = a.fields[orderBy];
      const bValue = b.fields[orderBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return orderDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        console.error(`Unsupported type for field "${orderBy}"`);
        return 0;
      }
    });

    return sortedArray;
  } catch (error) {
    console.error("Error in orderBy function:", error);
    return null;
  }
};
/*
export const getAllByAnswerValue = async (params: filterList) => {
  try {
    const { toBeFilteredObjArray, byField, byValue } = params;

    const filteredArray = toBeFilteredObjArray.filter((item) => {
      const answers = [...Object.values(item.fields)].flat();
      const answer = answers.find((answerRaw: AirtableRecord[]) => answerRaw.name === byField);

      return answer && answer.answer === String(byValue);
    });

    return filteredArray;
  } catch (error) {
    console.error("Error in getAllByAnswer function:", error);
  }
  return null;
};
*/
export const arrangeByRank = async (records: AirtableRecord[]) => {
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
      filteredObjArray: records,
      orderBy: "Tulos, sekunteina",
      orderDirection: "desc",
    });

    if (!sortedArray) {
      console.error("sortedArray is null or undefined");
      return null;
    }

    let currentRank = 1;

    for (let i = 0; i < sortedArray.length; i++) {
      const tulosSekunteina = await getFieldValue(records[i].fields, "Tulos, sekunteina");

      if (tulosSekunteina === undefined || tulosSekunteina === null) {
        return null;
      }

      const similarRanks = await filterByRecordValue(
        sortedArray,
        "Tulos, sekunteina",
        tulosSekunteina
      );
      if (!similarRanks || similarRanks.length === 0) {
        return null;
      }
      const nrOfOthersAtSameRank = similarRanks.length;

      for (let j = 0; j < similarRanks.length; j++) {
        const tulos = await getFieldValue(sortedArray[i + j].fields, "Tulos, sekunteina");
        const person = await getFieldValue(sortedArray[i + j].fields, "Nimi tai nimimerkki");
        const school = await getFieldValue(sortedArray[i + j].fields, "Oppilaitos");
        const eventCity = await getFieldValue(sortedArray[i + j].fields, "Tapahtuman kaupunki");
        const workplace = await getFieldValue(sortedArray[i + j].fields, "Työpaikka");
        const eventDate = await getFieldValue(sortedArray[i + j].fields, "Tapahtuman päivä");
        const eventName = await getFieldValue(sortedArray[i + j].fields, "Tapahtuman nimi");
        const institute = school || workplace;

        rankedArray.push({
          rank: currentRank,
          nrOfOthersAtSameRank: nrOfOthersAtSameRank,
          record: Number(tulos),
          byPerson: String(person),
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

export const prepareHTMLOld = async (rankedList: rankedList, printStyle: string) => {
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
        const imageUrl = await getFieldValue(results[i + j].tulos.fields, "Ota tuuletuskuva!");

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

          const opintolinja =
            (await getFieldValue(results[i + j].tulos.fields, "Opintolinja")) || "";
          if (opintolinja !== "") {
            var startParagraph = "<p" + className + ">";
            var firstRow = String(opintolinja);

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
        const imageArr = await getFieldValue(results[i + j].tulos.fields, "Ota tuuletuskuva! copy");

        var imageUrl = "";
        var thumbUrl = "";
        if (imageArr && Array.isArray(imageArr) && imageArr.length > 0) {
          const imageThumbs = imageArr[0]["thumbnails"];
          if (imageThumbs) {
            const smallImage = imageThumbs["small"];
            if (smallImage) {
              thumbUrl = smallImage["url"];
            }
            const largeImage = imageThumbs["large"];
            if (largeImage) {
              imageUrl = largeImage["url"];
            }
          }
        }

        imageCode = "";
        imageButtonCode = "";
        imageStart = "";
        imageEnd = "";
        imageMiddle = "";
        if (imageUrl !== "" && imageUrl !== "Not Defined") {
          /*
            imageButtonCode =
            "<img src='" +
            thumbUrl +
            "' class='tuuletuskuva-pieni' onclick='placeImgsrc2(\"" +
            imageUrl +
            "\"); '/>";
            */

          imageButtonCode =
            "<button class='tuuletuskuva-pieni-eitoimikaan-aina js-show-modal button js-show-modal' type='button' onclick='placeImgsrc2(\"" +
            imageUrl +
            "\"); '>Kuva</button>";

          /*        
          imageButtonCode =
            "<a href=\"#modal-wrapper\" class='tuuletuskuva-pieni' type='button' onclick='placeImgsrc2(\"" +
            imageUrl +
            "\"); '>Katso Kuva</a>";
*/
          /*
          imageButtonCode =
            '<BR /><a href="' + imageUrl + "\" type='button' target='_blank'> Katso Kuva</a>";
*/
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

          const opintolinja =
            (await getFieldValue(results[i + j].tulos.fields, "Opintolinja")) || "";
          if (opintolinja !== "") {
            var startParagraph = "<p" + className + ">";
            var firstRow = String(opintolinja);

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
        const tuloste =
          imageStart + rankHeader + paragraphsAtRank + imageMiddle + imageButtonCode + imageEnd;

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
