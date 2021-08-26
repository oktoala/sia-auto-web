"use strict";
const functions = require("firebase-functions");
const { user } = require("firebase-functions/v1/auth");
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');
exports.scraper = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const text = JSON.parse(request.body);
        // console.log(typeof body.text);
        console.log(text);
        // const text = encodeURIComponent(body.text.trim());
        const data = await scrapeImages(text);
        console.log(`Send this ${data}`);
        response.send(data);
    });
});
const scrapeImages = async (mahasiswa) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://sia.unmul.ac.id/login');
    // ! Login Page
    await page.screenshot({ path: '1.png' });
    await page.type('input[name=usr]', mahasiswa.nim);
    await page.type('input[name=pwd]', mahasiswa.password);
    const securityCode = await page.evaluate(() => {
        return document.querySelector(".form-group:nth-child(3) > div").innerHTML;
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
        document.querySelector('li:nth-child(4) > ul > li > a').click();
    });
    // await page.click('li:nth-child(4) > ul > li > a'); 
    await page.screenshot({ path: '3.png' });
    // ! KHS Page
    await page.waitForSelector('h5', {
        visible: true
    }).then(() => console.log("Dapat Lagi"));
    const data = await page.evaluate(() => {
        const nama = (document.querySelectorAll('div'));
        const url = Array.from(nama).map(v => v.className);
        // const urls = Array.from(images).map(v => v.src);
        return url;
    });
    await page.screenshot({ path: '4.png' });
    await browser.close();
    // console.log(data);
    return data;
};
//# sourceMappingURL=index.js.map