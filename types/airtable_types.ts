export enum sarjat {
  opiskelija = "Opiskelija",
  artisti = "Artisti",
}

export enum lajit {
  rodeoharka_normaali = "Rodeohärkä - normaali",
  rodeoharka_rahapalkinto = "Rodeohärkä - rahapalkinto",
  rodeoankka_normaali = "Ankkarodeo - normaali",
  rodeoankka_rahapalkinto = "Ankkarodeo - rahapalkinto",
}

export enum sukupuolet {
  mies = "Mies",
  nainen = "Nainen",
  muu = "Muu",
}

export enum montakoOli {
  yksi = "1 - yksilösuoritus",
  kaksi = "2 - 2 päällä!",
  kolme = "3 - 3 päällä!",
  neljä = "4 - jopa 4 päällä!",
  viisi = "5 - Mitä? Jopa 5 päällä yhtäaikaa!",
}

export enum tulosKentat {
  "Muuta tietoa" = "Muuta tietoa",
  "Nimi tai nimimerkki" = "Nimi tai nimimerkki",
  Sarja = "Sarja",
  Opintolinja = "Opintolinja",
  Oppilaitos = "Oppilaitos",
  Työpaikka = "Työpaikka",
  "Ikä suorituksen aikana" = "Ikä suorituksen aikana",
  Sukupuoli = "Sukupuoli",
  Asuinkaupunki = "Asuinkaupunki",
  "Opiskelupaikan kaupunki" = "Opiskelupaikan kaupunki",
  "Tapahtuman nimi" = "Tapahtuman nimi",
  "Tapahtuman päivä" = "Tapahtuman päivä",
  "Tapahtuman kaupunki" = "Tapahtuman kaupunki",
  "Työpaikan kaupunki" = "Työpaikan kaupunki",
  "Tulos, sekunteina" = "Tulos, sekunteina",
  Laji = "Laji",
  "Ota tuuletuskuva!" = "Ota tuuletuskuva!",
  "Ota tuuletuskuva! copy" = "Ota tuuletuskuva! copy",
  "Montako oli yhtä aikaa kyydissä?" = "Montako oli yhtä aikaa kyydissä?",
}

export interface airtable_attachmentImageArray {
  id: string;
  url: string;
  filename: string;
  height: number;
  width: number;
  size: number;
  type: string;
  thumbnails: {
    small: {
      url: string;
      width: number;
      height: number;
    };
    large: {
      url: string;
      width: number;
      height: number;
    };
    full: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface airtable_Kisatilastot_Perusta {
  Asuinkaupunki?: string;
  "Ikä suorituksen aikana"?: number;
  Laji?: lajit;
  "Montako oli yhtä aikaa kyydissä?"?: montakoOli;
  "Nimi tai nimimerkki"?: string[];
  Opintolinja?: string;
  "Opiskelupaikan kaupunki"?: string;
  Oppilaitos?: string;
  "Ota tuuletuskuva!"?: string;
  "Ota tuuletuskuva! copy"?: airtable_attachmentImageArray[];
  Sarja?: sarjat[];
  "Submission Date"?: Date;
  Sukupuoli?: sukupuolet;
  "Tapahtuman kaupunki"?: string;
  "Tapahtuman nimi"?: string;
  "Tapahtuman päivä"?: Date;
  "Tulos, sekunteina"?: number;
  "Työpaikan kaupunki"?: string;
  Työpaikka?: string;
  "Muuta tietoa"?: string;
}

export interface AirtableRecord {
  id: string;
  fields: airtable_Kisatilastot_Perusta;
  createdTime: Date;
}

export interface AirtableResponse {
  records: AirtableRecord[];
}

export interface AirtableError {
  type: string;
  message: string;
  statusCode: number;
}

export interface rankedResult {
  rank: number;
  nrOfOthersAtSameRank: number;
  record: number;
  byPerson: string;
  at?: string;
  byInstitute?: string;
  tulos: AirtableRecord;
}

export interface rankedList {
  nrOfRanks: number;
  nrOfResults: number;
  results: rankedResult[];
  insertAtDivId: string;
  referenceId: string;
  modifiedAt: Date;
}
