import Airtable from "airtable";

// Configure Airtable
const base = new Airtable({ apiKey: "your_api_key" }).base("your_base_id");

// Function to fetch data from a specific table
async function fetchAirtableData(tableName: string): Promise<any[]> {
  const records: any[] = [];
  try {
    await base(tableName)
      .select()
      .eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map((record) => record.fields));
        fetchNextPage();
      });
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
    throw error;
  }
  return records;
}

// Example usage
(async () => {
  try {
    const data = await fetchAirtableData("your_table_name");
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
})();
