const functions = require("firebase-functions");
const { user } = require("firebase-functions/v1/auth");
const cors = require('cors')({ origin: true });

interface DataColleger {
    nim: string;
    password: string;
    semester: string | undefined;
    nilai: (string | undefined)[];
    cobaDulu: boolean;
}

exports.scraper = functions.https.onRequest((request: any, response: any) => {
    cors(request, response, async () => {
        const body = request.body;
        console.log(typeof body.text);

        const text = body;
        // const text = encodeURIComponent(body.text.trim());

        const data = await scrapeImages(text);

        response.send(data);
    })
})

const puppeteer = require('puppeteer');

const scrapeImages = async (mahasiswa: DataColleger) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://sia.unmul.ac.id/login');

    // ! Login Page

    await page.screenshot({ path: '1.png' });

    await page.type('input[name=usr]', mahasiswa.nim);

    await page.type('input[name=pwd]', mahasiswa.password);

    const securityCode = await page.evaluate(() => {
        return (document.querySelector(".form-group:nth-child(3) > div")as HTMLElement).innerHTML;
    });

    await page.type('input[name=sc]', securityCode);

    await page.screenshot({ path: '2.png' });

    await page.click('button[type=submit]');


    // ? Home Page

    await page.waitForSelector('h2', {
        visible: true
    }).then(() => console.log("Dapat"));

    await page.evaluate(() => {
        // Kartu Hasil Studi
        (document.querySelector('li:nth-child(4) > ul > li > a')as HTMLElement).click();
    })
    // await page.click('li:nth-child(4) > ul > li > a'); 

    await page.screenshot({ path: '3.png' });

    // ! KHS Page

    await page.waitForSelector('h5', {
        visible: true
    }).then(() => console.log("Dapat Lagi"));

    const data = await page.evaluate(() => {

        const nama = (document.querySelector('h5')as HTMLElement).innerHTML;

        // const urls = Array.from(images).map(v => v.src);

        return nama;
    });

    await page.screenshot({ path: '4.png' });


    await browser.close();

    console.log(data);

    return data;

}
