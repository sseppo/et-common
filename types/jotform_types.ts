export interface FormInfoContent {
  archived: string;
  count: string;
  created_at: string;
  favorite: string;
  height: string;
  id: string;
  last_submission: string;
  new: string;
  status: string;
  title: string;
  type: string;
  updated_at: string;
  url: string;
  username: string;
}

export enum tulosKentat {
  kisatulostenTalletus = "kisatulostenTalletus",
  emailAddress = "emailAddress",
  muutaTietoa = "muutaTietoa",
  kuvaTaiLinkki = "kuvaTai",
  submit = "submit",
  nimiTai = "nimiTai",
  sarja = "sarja",
  opintolinja = "opintolinja",
  oppilaitos = "oppilaitos",
  tyopaikka = "tyopaikka",
  ikaSuorituksen = "ikaSuorituksen",
  sukupuoli = "sukupuoli",
  asuinkaupunki = "asuinkaupunki",
  opiskelupaikanKaupunki = "opiskelupaikanKaupunki",
  igTagi = "igTagi",
  pageBreak = "pageBreak",
  tapahtumanNimi = "tapahtumanNimi",
  tapahtumanPaiva = "tapahtumanPaiva",
  tapahtumanKaupunki25 = "tapahtumanKaupunki25",
  tyopaikanKaupunki = "tyopaikanKaupunki",
  tulosSekunteina = "tulosSekunteina",
  laji = "laji",
  typeA = "typeA",
  montakoOli = "montakoOli",
}

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

export interface Vastaus {
  answer: string | sarjat[] | lajit[] | sukupuolet[] | montakoOli[];
}

export interface Vastaukset {
  answer?: string | sarjat[] | lajit[] | sukupuolet[] | montakoOli[];
  hackRecipients?: string;
  cfname?: string;
  name: tulosKentat;
  order: number;
  selectedField?: string;
  static?: string;
  prettyFormat?: string;
  text: string;
  type: string;
}

// tuloset
export interface JotForm_Content {
  answers: {
    [key: number]: Vastaukset[];
  };
  created_at: string;
  flag: string;
  form_id: string;
  id: string;
  ip: string;
  new: string;
  notes: string;
  status: string;
  updated_at: string | null;
}

export interface JotFormData {
  content: {
    [key: number]: JotForm_Content[];
  };
  duration: string;
  info: string | null;
  "limit-left": number;
  message: string;
  responseCode: number;
  resultSet: {
    count: number;
    limit: number;
    offset: number;
  };
}

export interface rankedResult {
  rank: number;
  nrOfOthersAtSameRank: number;
  record: number;
  byPerson: string;
  at?: string;
  byInstitute?: string;
  tulos: JotForm_Content;
}

export interface rankedList {
  nrOfRanks: number;
  nrOfResults: number;
  results: rankedResult[];
  insertAtDivId: string;
  referenceId: string;
  modifiedAt: Date;
}

// TODO: saako näitä jostain suoraan jotformista?
