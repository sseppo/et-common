import axios from "axios";
import {
  JotFormData,
  FormInfoContent,
  JotForm_Content,
  rankedResult,
  rankedList,
} from "../../types/jotform_types";
import { serverData } from "../../server";

var numberOfSubmissions = 0;
var retreiveSubmissionsAmount = 0;

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
const { serverUrl } = serverData();

const tilastoFormId = "251136488455059";

export const jotform_getFormInfo = async (formId) => {
  try {
    if (!serverUrl) {
      console.error("Server URL is not defined");
      return;
    }
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

export const jotform_getTilastot = async ({ offset, limit, filter, orderby }) => {
  const combinedTulokset = [];
  var fromJotForm: JotForm_Content[] = [];
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
      await jotform_getTilastot(hakuParametrit);
    }
  } catch (error) {
    console.error("Error fetching tilastot data:", error);
  }
  return fromJotForm;
};

export const jotform_getRawData = async (formId) => {
  await jotform_getFormInfo(formId);
  const rawData = await jotform_getTilastot(hakuParametrit);
  return rawData;
};
