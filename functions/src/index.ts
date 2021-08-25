const functions = require("firebase-functions");
const { user } = require("firebase-functions/v1/auth");
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');


interface DataColleger {
    nim: string;
    password: string;
    semester: string | undefined;
    nilai: (string | undefined)[];
    cobaDulu: boolean;
}

exports.scraper = functions.https.onRequest((request: any, response: any) => {
    cors(request, response, async () => {
        const text = JSON.parse(request.body);
        console.log(text);

        // const text = encodeURIComponent(body.text.trim());

        const data = await scrapeImages(text);

        console.log(`Send this ${data}`);
        response.send(data);
    })
})


const scrapeImages = async (mahasiswa: DataColleger) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://sia.unmul.ac.id/login');

    // ! Login Page


    await page.type('input[name=usr]', mahasiswa.nim);

    await page.type('input[name=pwd]', mahasiswa.password);

    const securityCode = await page.evaluate(() => {
        return (document.querySelector(".form-group:nth-child(3) > div") as HTMLElement).innerHTML;
    });

    await page.type('input[name=sc]', securityCode);

    await page.click('button[type=submit]');


    // ? Home Page

    await page.waitForSelector('h2', {
        visible: true
    }).then(() => console.log("Dapat KHS"));

    await page.evaluate(() => {
        // Kartu Hasil Studi
        (document.querySelector('li:nth-child(4) > ul > li > a') as HTMLElement).click();
    })

    // ! KHS Page

    await page.waitForSelector('h5', {
        visible: true
    });

    const data = await page.evaluate(() => {

        const nama = (document.querySelectorAll('div'));

        const url = Array.from(nama).map(v => v.className);

        return url;
    });

    await browser.close();

    return data;

}
