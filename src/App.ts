import fs from 'fs'
import merge from 'easy-pdf-merge'
import PDFDocument from 'pdfkit'
import getPageCount from 'docx-pdf-pagecount'
import shortid from 'shortid'
import readline from "readline"
import inquirer from 'inquirer'

const id = shortid.generate()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.readdir('./src/public/', async (err, files) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(`./src/dummy/output-${id}.pdf`));

    const questions = files.map((data: any, index) => ({ type: 'input', name: `${index}`, message: data }))

    inquirer.prompt(questions).then((answers: any) => {
        files.map((data: any, index: number) => doc.fontSize(25).text(data + ' -> ' + answers[index], 100, ((index + 1) * 50)))
        doc.scale(0.6)
            .translate(470, -380)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('red', 'even-odd')
            .restore();
        doc.end();

        const final = files.map(item => `${'./src/public/' + item}`)
        final.unshift(`./src/dummy/output-${id}.pdf`)

        merge(final, `./src/output/File-${id}.pdf`, (errs: any) => {
            if (errs) {
                return console.log(errs)
            }
            console.log('Successfully merged! ->', `src/output/File-${id}.pdf`)
            fs.unlink(`./src/dummy/output-${id}.pdf`, () => {
                console.log('');
            })
        });
    });

});