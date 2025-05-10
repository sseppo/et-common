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
exports.sortByBestOf = exports.getAnswerOf = exports.orderBy = exports.sortBy = void 0;
var sortBy = function (parametrit) { return __awaiter(void 0, void 0, void 0, function () {
    var tuloksetRawArr, rajaukset_1, flattenedArray, filteredArray;
    return __generator(this, function (_a) {
        try {
            tuloksetRawArr = parametrit.tuloksetRawArr, rajaukset_1 = parametrit.rajaukset;
            flattenedArray = tuloksetRawArr.flat();
            filteredArray = flattenedArray.filter(function (item) {
                return Object.entries(rajaukset_1).every(function (_a) {
                    var key = _a[0], value = _a[1];
                    var vastauksetRawArr = __spreadArray([], Object.values(item.answers), true).flat();
                    var vastauksetEka = vastauksetRawArr.find(function (answerRaw) {
                        if (answerRaw.name === key) {
                            if (key === "sarja" || key === "sukupuoli") {
                                if (Array.isArray(answerRaw.answer)) {
                                    return answerRaw.answer.some(function (ans) { return ans === value; });
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                if (answerRaw.answer === value) {
                                    // tänne tulee myös || key === "laji"  ja || key === "montakoOli"
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                    });
                    return vastauksetEka;
                    // return vastauksetEka && vastauksetEka.text === value;
                });
            });
            console.log("filteredArray", filteredArray);
            return [2 /*return*/, filteredArray];
        }
        catch (error) {
            console.error("Error in sortBy function:", error);
        }
        return [2 /*return*/];
    });
}); };
exports.sortBy = sortBy;
var orderBy = function (orderParams) { return __awaiter(void 0, void 0, void 0, function () {
    var filteredObjArray, orderBy_1, orderDirection_1, sortedArray;
    return __generator(this, function (_a) {
        try {
            filteredObjArray = orderParams.filteredObjArray, orderBy_1 = orderParams.orderBy, orderDirection_1 = orderParams.orderDirection;
            sortedArray = filteredObjArray.sort(function (a, b) {
                var _a, _b;
                var aAnswers = __spreadArray([], Object.values(a.answers), true).flat();
                var bAnswers = __spreadArray([], Object.values(b.answers), true).flat();
                var aAnswer = aAnswers.find(function (answer) { return answer.name === orderBy_1; });
                var bAnswer = bAnswers.find(function (answer) { return answer.name === orderBy_1; });
                var aValue = (_a = aAnswers.find(function (answer) { return answer.name === orderBy_1; })) === null || _a === void 0 ? void 0 : _a.answer;
                var bValue = (_b = bAnswers.find(function (answer) { return answer.name === orderBy_1; })) === null || _b === void 0 ? void 0 : _b.answer;
                if (typeof aValue === "number" && typeof bValue === "number") {
                    return orderDirection_1 === "asc" ? aValue - bValue : bValue - aValue;
                }
                else if (typeof aValue === "string" && typeof bValue === "string") {
                    return orderDirection_1 === "asc"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                else {
                    return 0; // If values are not comparable, keep original order
                }
            });
            console.log("sortedArray", sortedArray);
            return [2 /*return*/, sortedArray];
        }
        catch (error) {
            console.error("Error in orderBy function:", error);
        }
        return [2 /*return*/];
    });
}); };
exports.orderBy = orderBy;
var getAnswerOf = function (answerParams) { return __awaiter(void 0, void 0, void 0, function () {
    var answers, answerOf_1, vastaukset, vastauksetEka;
    return __generator(this, function (_a) {
        try {
            answers = answerParams.answers, answerOf_1 = answerParams.answerOf;
            vastaukset = __spreadArray([], Object.values(answers), true).flat();
            vastauksetEka = vastaukset.find(function (answerRaw) {
                if (answerRaw.name === answerOf_1) {
                    return answerRaw.answer;
                }
            });
            return [2 /*return*/, vastauksetEka ? vastauksetEka.answer : null];
        }
        catch (error) {
            console.error("Error in getAnswerOf function:", error);
        }
        return [2 /*return*/, null];
    });
}); };
exports.getAnswerOf = getAnswerOf;
var sortByBestOf = function (bestOfParams) { return __awaiter(void 0, void 0, void 0, function () {
    var tuloksetObjArray, bestOf, orderDirection_2, filteredArr, _loop_1, _i, _a, _b, key, value, sortedArr, sortedObjArr, i, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                console.log("--- sortByBestOf");
                tuloksetObjArray = bestOfParams.tuloksetObjArray, bestOf = bestOfParams.bestOf, orderDirection_2 = bestOfParams.orderDirection;
                filteredArr = [];
                _loop_1 = function (key, value) {
                    var filterByValue, bestOfvalue, _d, existingEntry;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, (0, exports.getAnswerOf)({ answers: value.answers, answerOf: bestOf })];
                            case 1:
                                filterByValue = _e.sent();
                                _d = Number;
                                return [4 /*yield*/, (0, exports.getAnswerOf)({ answers: value.answers, answerOf: "tulosSekunteina" })];
                            case 2:
                                bestOfvalue = _d.apply(void 0, [_e.sent()]);
                                console.log("filteredArr ennen lisäyksiä", filteredArr);
                                console.log("filterByValue", filterByValue);
                                console.log("bestOfvalue", bestOfvalue);
                                if (!filterByValue && !bestOfvalue) {
                                    console.log("ei löytynyt tulsota vaadittuja arvoja, ei lisätä");
                                    return [2 /*return*/, "continue"];
                                }
                                existingEntry = filteredArr.find(function (entry) { return entry.filteri === filterByValue; });
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
                                }
                                else {
                                    console.log("löydettiin, päivitetään tulos");
                                    if (orderDirection_2 === "asc") {
                                        if (bestOfvalue < existingEntry.tulos) {
                                            existingEntry.tulos = bestOfvalue;
                                            existingEntry.formObj = value;
                                        }
                                    }
                                    else {
                                        if (bestOfvalue > existingEntry.tulos) {
                                            existingEntry.tulos = bestOfvalue;
                                            existingEntry.formObj = value;
                                        }
                                    }
                                }
                                console.log("filteredArr tsekkausten jälkeen ", filteredArr);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = Object.entries(tuloksetObjArray);
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                _b = _a[_i], key = _b[0], value = _b[1];
                return [5 /*yield**/, _loop_1(key, value)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                sortedArr = filteredArr.sort(function (a, b) {
                    if (orderDirection_2 === "asc") {
                        return a.tulos - b.tulos;
                    }
                    else {
                        return b.tulos - a.tulos;
                    }
                });
                sortedObjArr = [];
                for (i = 0; i < sortedArr.length; i++) {
                    sortedObjArr.push(sortedArr[i].formObj);
                }
                return [2 /*return*/, sortedObjArr];
            case 5:
                error_1 = _c.sent();
                console.error("Error in getAnswerOf function:", error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, null];
        }
    });
}); };
exports.sortByBestOf = sortByBestOf;
console.log("tilastosivu2");
