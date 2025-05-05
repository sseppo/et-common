"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.montakoOli = exports.sukupuolet = exports.lajit = exports.sarjat = exports.tulosKentat = void 0;
var tulosKentat;
(function (tulosKentat) {
    tulosKentat["kisatulostenTalletus"] = "kisatulostenTalletus";
    tulosKentat["emailAddress"] = "emailAddress";
    tulosKentat["muutaTietoa"] = "muutaTietoa";
    tulosKentat["kuvaTaiLinkki"] = "kuvaTai";
    tulosKentat["submit"] = "submit";
    tulosKentat["nimiTai"] = "nimiTai";
    tulosKentat["sarja"] = "sarja";
    tulosKentat["opintolinja"] = "opintolinja";
    tulosKentat["oppilaitos"] = "oppilaitos";
    tulosKentat["tyopaikka"] = "tyopaikka";
    tulosKentat["ikaSuorituksen"] = "ikaSuorituksen";
    tulosKentat["sukupuoli"] = "sukupuoli";
    tulosKentat["asuinkaupunki"] = "asuinkaupunki";
    tulosKentat["opiskelupaikanKaupunki"] = "opiskelupaikanKaupunki";
    tulosKentat["igTagi"] = "igTagi";
    tulosKentat["pageBreak"] = "pageBreak";
    tulosKentat["tapahtumanNimi"] = "tapahtumanNimi";
    tulosKentat["tapahtumanPaiva"] = "tapahtumanPaiva";
    tulosKentat["tapahtumanKaupunki25"] = "tapahtumanKaupunki25";
    tulosKentat["tyopaikanKaupunki"] = "tyopaikanKaupunki";
    tulosKentat["tulosSekunteina"] = "tulosSekunteina";
    tulosKentat["laji"] = "laji";
    tulosKentat["typeA"] = "typeA";
    tulosKentat["montakoOli"] = "montakoOli";
})(tulosKentat || (exports.tulosKentat = tulosKentat = {}));
var sarjat;
(function (sarjat) {
    sarjat["opiskelija"] = "Opiskelija";
    sarjat["artisti"] = "Artisti";
})(sarjat || (exports.sarjat = sarjat = {}));
var lajit;
(function (lajit) {
    lajit["rodeoharka_normaali"] = "Rodeoh\u00E4rk\u00E4 - normaali";
    lajit["rodeoharka_rahapalkinto"] = "Rodeoh\u00E4rk\u00E4 - rahapalkinto";
    lajit["rodeoankka_normaali"] = "Ankkarodeo - normaali";
    lajit["rodeoankka_rahapalkinto"] = "Ankkarodeo - rahapalkinto";
})(lajit || (exports.lajit = lajit = {}));
var sukupuolet;
(function (sukupuolet) {
    sukupuolet["mies"] = "Mies";
    sukupuolet["nainen"] = "Nainen";
    sukupuolet["muu"] = "Muu";
})(sukupuolet || (exports.sukupuolet = sukupuolet = {}));
var montakoOli;
(function (montakoOli) {
    montakoOli["yksi"] = "1 - yksil\u00F6suoritus";
    montakoOli["kaksi"] = "2 - 2 p\u00E4\u00E4ll\u00E4!";
    montakoOli["kolme"] = "3 - 3 p\u00E4\u00E4ll\u00E4!";
    montakoOli["nelj\u00E4"] = "4 - jopa 4 p\u00E4\u00E4ll\u00E4!";
    montakoOli["viisi"] = "5 - Mit\u00E4? Jopa 5 p\u00E4\u00E4ll\u00E4 yht\u00E4aikaa!";
})(montakoOli || (exports.montakoOli = montakoOli = {}));
// TODO: saako näitä jostain suoraan jotformista?
