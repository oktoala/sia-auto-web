const functions = require("firebase-functions");
const { user } = require("firebase-functions/v1/auth");
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');


interface DataColleger {
    nim: string;
    password: string;
    semId: string | undefined;
    nilai: (string | undefined)[];
    cobaDulu: boolean;
}

exports.scraper = functions.https.onRequest((request: any, response: any) => {
    cors(request, response, async () => {
        const text = JSON.parse(request.body);
        console.log(text);

        const data = await scrapeImages(text);

        console.log(`Send this ${data}`);
        response.send(data);
    });
})


const scrapeImages = async (mahasiswa: DataColleger) => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://sia.unmul.ac.id/login');

    // ! Login Page

    await page.waitForSelector('input[name=usr]', {
        visible: true,
    }).then(() => console.log('Dapat Input Login'));

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
    });

    // ! KHS Page

    await page.waitForSelector('h5', {
        visible: true
    });

    const semId = mahasiswa.semId;

    // Send Request according to semester id
    await page.evaluate((semId: string) => {
        console.log('wkwkwk');
        const http = new XMLHttpRequest();

        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE) {
                if (http.status == 200) {
                    (document.querySelector('#response') as HTMLElement).innerHTML = http.response;
                    console.log('hahah');
                } else {
                    console.log('heheh');
                }
            }
        }

        http.open('POST', '/pmhskhs/loaddatas', true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        http.send(`semId=${semId}`);
        
    }, semId);

    // Wait for link has been visible

    await page.waitForSelector('#response a', {
        visible: true,
    }).then(() => console.log('Dapat Link'));
    
    // Get All the link to array

    const data = await page.evaluate(() => {
        const hrefs = document.querySelectorAll('#response a');

        const href = Array.from(hrefs).map(v => v.getAttribute('href'));

        console.log(`hrefs ${hrefs}`);
        console.log(href);

        return href;
    });

    // Execute every kuesioner

    for await (const link of data) {
        const pageKHS = await browser.newPage();
        await pageKHS.goto(link);

        await pageKHS.waitForSelector('#sipform > div > ul > li > a', {
            visible: true
        }).then(() => console.log('Udah di kuesioner'));


        // Get All tabs (ex: Kesiapan Mengajar, Materi Pengajaran, ...)
        const tabs = await pageKHS.evaluate(() => {
            const tabs = document.querySelectorAll('#sipform > div > ul > li > a');

            const tabArray = Array.from(tabs).map(v => v.getAttribute('href'));

            console.log(tabArray);

            return tabArray;
        });

        // Looping trough the tab
        for await (const tab of tabs) {
            console.log(tab);
            await pageKHS.click(`a[href="${tab}"]`);

            const radioBtns = await pageKHS.evaluate(() => {
                const btns = document.querySelectorAll(`${tab} tbody tr`);

                const btnArray = Array.from(btns);

                return btnArray;
            });

            for await (const radioBtn of radioBtns) {
                
            }
            
        }

    }

    console.log("Gerrr");

    // await browser.close();



}
