"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var tilastot_funktiot_1 = require("./tilastot_funktiot");
console.log("tilastosivu eka juttu2");
document.addEventListener("DOMContentLoaded", function () {
    var _this = this;
    var numberOfSubmissions = 0;
    var retreiveSubmissionsAmount = 0;
    var tuloksetRawObj = {};
    var tuloksetRArr = [];
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
    var getFormInfo = function (formId) { return __awaiter(_this, void 0, void 0, function () {
        var axiosOptions, response, formInfoData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    axiosOptions = {
                        method: "GET",
                        url: "http://localhost:5000/jotform/form-info/" + formId,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                    };
                    return [4 /*yield*/, (0, axios_1.default)(axiosOptions)];
                case 1:
                    response = _a.sent();
                    console.log("Form info response", response);
                    if (response.status !== 200) {
                        console.error("Error fetching tilastot data:", response.statusText);
                        return [2 /*return*/];
                    }
                    formInfoData = response.data.data.content;
                    numberOfSubmissions = Number(formInfoData.count);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching tilastot data:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getTilastot = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var combinedTulokset, urli, axiosOptions, response, tilastotData, tuloksetRawObj_1, tulolsetRawArr, resultSet, error_2;
        var offset = _b.offset, limit = _b.limit, filter = _b.filter, orderby = _b.orderby;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    combinedTulokset = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    urli = "http://localhost:5000/jotform/tilastot?hakuParametrit=" + JSON.stringify(hakuParametrit);
                    console.log("kysely lähtee, ", urli);
                    axiosOptions = {
                        method: "GET",
                        url: urli,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                    };
                    return [4 /*yield*/, (0, axios_1.default)(axiosOptions)];
                case 2:
                    response = _c.sent();
                    console.log("response", response);
                    if (response.status !== 200) {
                        console.error("Error fetching tilastot data:", response.statusText);
                        return [2 /*return*/];
                    }
                    tilastotData = response.data.data;
                    console.log("Tilastot data:", tilastotData);
                    tuloksetRawObj_1 = tilastotData.content;
                    console.log("tuloksetRawObj", tuloksetRawObj_1);
                    tulolsetRawArr = __spreadArray([], Object.values(tuloksetRawObj_1), true).flat();
                    console.log("tuloksetRawArray", tulolsetRawArr);
                    tuloksetRArr = tuloksetRArr.concat(tulolsetRawArr);
                    console.log("tuloksetRArr tällä kiekalla", tuloksetRArr);
                    resultSet = tilastotData.resultSet;
                    retreiveSubmissionsAmount += resultSet.count;
                    if (!(retreiveSubmissionsAmount < numberOfSubmissions)) return [3 /*break*/, 4];
                    hakuParametrit.offset = retreiveSubmissionsAmount;
                    return [4 /*yield*/, getTilastot(hakuParametrit)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _c.sent();
                    console.error("Error fetching tilastot data:", error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var tilastoFormId = "251136488455059";
    var haku = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // hae tiedot
                return [4 /*yield*/, getFormInfo(tilastoFormId)];
                case 1:
                    // hae tiedot
                    _a.sent();
                    return [4 /*yield*/, getTilastot(hakuParametrit)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var sarjat = function () { return __awaiter(_this, void 0, void 0, function () {
        var sarja_Opiskelijat_RodeoHarka_1, sarja_Opiskelijat_Rodeo_Ankka_1, sarja_Oppintolinja_RodeoHarka_1, sarja_Oppilaitos_RodeoHarka_1, ordederedSarja_Opiskelijat_RodeoHarka_1, testinappi, lista, contentToAdd, i, tulosSekunteina, tekija, sijoitus, nimi, tuloste, paikkaSivulla, lista, contentToAdd, i, tulosSekunteina, tekija, opintiolinja, sijoitus, nimi, tuloste, paikkaSivulla, lista, contentToAdd, i, tulosSekunteina, tekija, oppilaitos, sijoitus, nimi, tuloste;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("tuloksetRArr", tuloksetRArr);
                    if (!(tuloksetRArr && tuloksetRArr.length > 0)) return [3 /*break*/, 25];
                    return [4 /*yield*/, (0, tilastot_funktiot_1.sortBy)({
                            tuloksetRawArr: tuloksetRArr,
                            rajaukset: {
                                sarja: "Opiskelija",
                                laji: "Rodeohärkä - normaali",
                                montakoOli: "1 - yksilösuoritus",
                            },
                        })];
                case 1:
                    sarja_Opiskelijat_RodeoHarka_1 = _a.sent();
                    return [4 /*yield*/, (0, tilastot_funktiot_1.sortBy)({
                            tuloksetRawArr: tuloksetRArr,
                            rajaukset: {
                                sarja: "Opiskelija",
                                laji: "Ankkarodeo - normaali",
                                montakoOli: "1 - yksilösuoritus",
                            },
                        })];
                case 2:
                    sarja_Opiskelijat_Rodeo_Ankka_1 = _a.sent();
                    if (!sarja_Opiskelijat_RodeoHarka_1) return [3 /*break*/, 25];
                    console.log("opintiolinja sorttaukseen ", sarja_Opiskelijat_RodeoHarka_1);
                    return [4 /*yield*/, (0, tilastot_funktiot_1.sortByBestOf)({
                            tuloksetObjArray: sarja_Opiskelijat_RodeoHarka_1,
                            bestOf: "opintolinja",
                            orderDirection: "desc",
                        })];
                case 3:
                    sarja_Oppintolinja_RodeoHarka_1 = _a.sent();
                    /*
                    const sarja_Oppilaitokset_RodeoHarka_1 = await sortBy({
                      tuloksetRawArr: tuloksetRArr,
                      rajaukset: {
                        sarja: "Opiskelija",
                        laji: "Rodeohärkä - normaali",
                        montakoOli: "1 - yksilösuoritus",
                      },
                    });
            
                    */
                    console.log("sarja_Oppintolinja_RodeoHarka_1", sarja_Oppintolinja_RodeoHarka_1);
                    return [4 /*yield*/, (0, tilastot_funktiot_1.sortByBestOf)({
                            tuloksetObjArray: sarja_Opiskelijat_RodeoHarka_1,
                            bestOf: "oppilaitos",
                            orderDirection: "desc",
                        })];
                case 4:
                    sarja_Oppilaitos_RodeoHarka_1 = _a.sent();
                    console.log("sarja_Oppilaitos_RodeoHarka_1", sarja_Oppilaitos_RodeoHarka_1);
                    return [4 /*yield*/, (0, tilastot_funktiot_1.orderBy)({
                            filteredObjArray: sarja_Opiskelijat_RodeoHarka_1,
                            orderBy: "tulosSekunteina",
                            orderDirection: "desc",
                        })];
                case 5:
                    ordederedSarja_Opiskelijat_RodeoHarka_1 = _a.sent();
                    console.log("ordederedSarja_Opiskelijat_RodeoHarka_1", ordederedSarja_Opiskelijat_RodeoHarka_1);
                    if (!ordederedSarja_Opiskelijat_RodeoHarka_1) return [3 /*break*/, 11];
                    testinappi = document.querySelector("#ankka-1");
                    if (!testinappi)
                        return [2 /*return*/];
                    lista = ordederedSarja_Opiskelijat_RodeoHarka_1;
                    contentToAdd = "";
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < lista.length)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "tulosSekunteina",
                        })];
                case 7:
                    tulosSekunteina = _a.sent();
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "nimiTai",
                        })];
                case 8:
                    tekija = _a.sent();
                    sijoitus = "<h6>" + (i + 1) + ". Sija, aika " + tulosSekunteina + " s</h6>";
                    nimi = "<p>" + tekija + "</p>";
                    if (sijoitus !== undefined && nimi != undefined) {
                        tuloste = sijoitus + nimi;
                        contentToAdd += tuloste;
                    }
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 6];
                case 10:
                    //          console.log("contentToAdd", contentToAdd);
                    testinappi.innerHTML = contentToAdd;
                    _a.label = 11;
                case 11:
                    if (!sarja_Oppintolinja_RodeoHarka_1) return [3 /*break*/, 18];
                    paikkaSivulla = document.querySelector("#opintolinja-rh-1");
                    if (!paikkaSivulla)
                        return [2 /*return*/];
                    lista = sarja_Oppintolinja_RodeoHarka_1;
                    console.log("lista ennen tulostusta", lista);
                    contentToAdd = "";
                    i = 0;
                    _a.label = 12;
                case 12:
                    if (!(i < lista.length)) return [3 /*break*/, 17];
                    console.log("lista[i].answers", lista[i].answers);
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "tulosSekunteina",
                        })];
                case 13:
                    tulosSekunteina = _a.sent();
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "nimiTai",
                        })];
                case 14:
                    tekija = _a.sent();
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "opintolinja",
                        })];
                case 15:
                    opintiolinja = _a.sent();
                    sijoitus = "<h6>" + (i + 1) + ". Sija, aika " + tulosSekunteina + " s</h6>";
                    nimi = "<p>" + opintiolinja + "<BR /><span class='pienifontti'>" + tekija + "</span></p>";
                    if (sijoitus !== undefined && nimi != undefined) {
                        tuloste = sijoitus + nimi;
                        contentToAdd += tuloste;
                    }
                    _a.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 12];
                case 17:
                    //  console.log("contentToAdd", contentToAdd);
                    paikkaSivulla.innerHTML = contentToAdd;
                    _a.label = 18;
                case 18:
                    if (!sarja_Oppilaitos_RodeoHarka_1) return [3 /*break*/, 25];
                    paikkaSivulla = document.querySelector("#oppilaitos-rh-1");
                    if (!paikkaSivulla)
                        return [2 /*return*/];
                    lista = sarja_Oppilaitos_RodeoHarka_1;
                    console.log("lista ennen tulostusta", lista);
                    contentToAdd = "";
                    i = 0;
                    _a.label = 19;
                case 19:
                    if (!(i < lista.length)) return [3 /*break*/, 24];
                    console.log("lista[i].answers", lista[i].answers);
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "tulosSekunteina",
                        })];
                case 20:
                    tulosSekunteina = _a.sent();
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "nimiTai",
                        })];
                case 21:
                    tekija = _a.sent();
                    return [4 /*yield*/, (0, tilastot_funktiot_1.getAnswerOf)({
                            answers: lista[i].answers,
                            answerOf: "oppilaitos",
                        })];
                case 22:
                    oppilaitos = _a.sent();
                    sijoitus = "<h6>" + (i + 1) + ". Sija, aika " + tulosSekunteina + " s</h6>";
                    nimi = "<p>" +
                        oppilaitos +
                        "<BR /><span class='tilastot-pienifontti'>" +
                        tekija +
                        "</span></p>";
                    if (sijoitus !== undefined && nimi != undefined) {
                        tuloste = sijoitus + nimi;
                        contentToAdd += tuloste;
                    }
                    _a.label = 23;
                case 23:
                    i++;
                    return [3 /*break*/, 19];
                case 24:
                    //  console.log("contentToAdd", contentToAdd);
                    paikkaSivulla.innerHTML = contentToAdd;
                    _a.label = 25;
                case 25: return [2 /*return*/];
            }
        });
    }); };
    var asyncApu = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, haku()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sarjat()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    asyncApu();
});
console.log("tilastosivu2");
