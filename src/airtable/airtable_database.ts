import axios from "axios";
import { serverData } from "../../server";

const { serverUrl } = serverData();

export const airtable_getTable = async (base, tableId) => {
  try {
    if (!serverUrl) {
      console.error("Server URL is not defined");
      return;
    }

    const params = {
      base: base,
      table: tableId,
    };
    const axiosOptions = {
      method: "GET",
      url: serverUrl + "/airtable/table?params=" + JSON.stringify(params),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    console.log("Airtable axiosOptions", axiosOptions);
    const response = await axios(axiosOptions);

    //log("Form info response", response);
    if (response.status !== 200) {
      console.error("Error fetching tilastot data:", response.statusText);
      return;
    }

    console.log("Airtable res ", response);

    return response.data;
    //const formInfoData: FormInfoContent = response.data.data.content;

    //numberOfSubmissions = Number(formInfoData.count);
  } catch (error) {
    console.error("Error fetching tilastot data:", error);
  }
};

export const airtable_getRawData = async (base, table) => {
  await airtable_getTable(base, table);
  return true;
};
