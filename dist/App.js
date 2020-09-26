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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const easy_pdf_merge_1 = __importDefault(require("easy-pdf-merge"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const shortid_1 = __importDefault(require("shortid"));
const readline_1 = __importDefault(require("readline"));
const inquirer_1 = __importDefault(require("inquirer"));
const id = shortid_1.default.generate();
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
fs_1.default.readdir('./src/public/', (err, files) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new pdfkit_1.default();
    doc.pipe(fs_1.default.createWriteStream(`./src/dummy/output-${id}.pdf`));
    const questions = files.map((data, index) => ({ type: 'input', name: `${index}`, message: data }));
    inquirer_1.default.prompt(questions).then((answers) => {
        files.map((data, index) => doc.fontSize(25).text(data + ' -> ' + answers[index], 100, ((index + 1) * 50)));
        doc.scale(0.6)
            .translate(470, -380)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('red', 'even-odd')
            .restore();
        doc.end();
        const final = files.map(item => `${'./src/public/' + item}`);
        final.unshift(`./src/dummy/output-${id}.pdf`);
        easy_pdf_merge_1.default(final, `./src/output/File-${id}.pdf`, (errs) => {
            if (errs) {
                return console.log(errs);
            }
            console.log('Successfully merged! ->', `src/output/File-${id}.pdf`);
            fs_1.default.unlink(`./src/dummy/output-${id}.pdf`, () => {
                console.log('');
            });
        });
    });
}));
//# sourceMappingURL=App.js.map