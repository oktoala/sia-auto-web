const functions = require("firebase-functions");
const { user } = require("firebase-functions/v1/auth");
const cors = require('cors')({ origin: true });

// const cheerio = require('cheerio');
// const getUrls = require('get-urls');
// const fetch = require('node-fetch');

// const scrapeMetaTags = (text) => {

//     const urls = Array.from(getUrls(text));
//     console.log(urls);
//     // const urls = [`https://shoppe.co.id/search?keyword=${text}`, `https://www.tokopedia.com/search?st=product&q=${text}&navsource=home`];

    
//     const request = urls.map(async url => {
        
//         const res = await fetch(url);
//         const html = await res.text();
//         const $ = cheerio.load(html);

//         // const getMetaTag = (text) =>
//         //     $(`meta[name="${text}""`).attr('content') ||
//         //     $(`meta[property="og:${text}]`).attr('content') ||
//         //     $(`meta[property="twitter:${text}]`).attr('content');

//         return {
//             url,
//             title: $('title').first().text(),
//             token: $('meta[name="csrf-token"]').attr('content')
//             // description: $('body').text()
//             // image: getMetaTag('image'),
//             // author: getMetaTag('author'),
//         }
//     });

//     return Promise.all(request);

// }
exports.scraper = functions.https.onRequest((request, response) => {
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

const scrapeImages = async (mahasiswa) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://sia.unmul.ac.id/login');

    // ! Login Page

    await page.screenshot({path: '1.png'});

    await page.type('input[name=usr]', mahasiswa.username);

    await page.type('input[name=pwd]', mahasiswa.password);

    const securityCode = await page.evaluate(() => {
        return document.querySelector(".form-group:nth-child(3) > div").innerHTML;
    });

    await page.type('input[name=sc]', securityCode);

    await page.screenshot({path: '2.png'});
    
    await page.click('button[type=submit]');

    
    // ? Home Page

    await page.waitForSelector('h2', {
        visible: true
    }).then(() => console.log("Dapat"));

    await page.evaluate(() => {
        // Kartu Hasil Studi
        document.querySelector('li:nth-child(4) > ul > li > a').click();
    })
    // await page.click('li:nth-child(4) > ul > li > a'); 
    
    await page.screenshot({path: '3.png'});

    // ! KHS Page

    await page.waitForSelector('h5', {
        visible: true
    }).then(() => console.log("Dapat Lagi"));
    
    const data = await page.evaluate( () => {
        
        const nama = document.querySelector('h5').innerHTML;
        
        // const urls = Array.from(images).map(v => v.src);
        
        return nama;
    });

    await page.screenshot({path: '4.png'});

    
    await browser.close();

    console.log(data);

    return data;

}
