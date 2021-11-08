// eslint-disables-next-line @typescript-eslint/no-var-requires
const functions = require("firebase-functions");
// eslint-disables-next-line @typescript-eslint/no-var-requires
const cors = require("cors")({ origin: true });
// eslint-disables-next-line @typescript-eslint/no-var-requires
const puppeteer = require("puppeteer");


interface DataColleger {
  nim: string;
  password: string;
  semId: string | undefined;
  nilai: (string | undefined)[];
  cobaDulu: boolean;
}

exports.scraper = functions
  .runWith({ timeoutSeconds: 300 })
  .https.onRequest((request: any, response: any) => {
    cors(request, response, async () => {
      console.log(typeof request.body);
      const text = JSON.parse(request.body);
      // const text = request.body;
      console.log(text);

      const data = await scrapeImages(text);

      console.log(`Send this ${data}`);
      response.send(data);
    });
  });


const scrapeImages = async (mahasiswa: DataColleger) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://sia.unmul.ac.id/login", { waituntil: "load", timeout: 100000 });
    // ! Login Page

    await page.waitForSelector("input[name=usr]", {
      visible: true,
    }).then(() => console.log("Dapat Input Login"));


    await page.type("input[name=usr]", mahasiswa.nim);

    await page.type("input[name=pwd]", mahasiswa.password);

    const securityCode = await page.evaluate(() => {
      return (document.querySelector(".form-group:nth-child(3) > div") as HTMLElement).innerHTML;
    });

    await page.type("input[name=sc]", securityCode);

    await page.click("button[type=submit]");

    // ? Home Page
    try {
      await page.waitForSelector("h2", {
        visible: true,
        timeout: 5000,
      }).then(() => console.log("Dapat KHS"));
    } catch (error) {
      return { response: "NIM dan Password tidak cocok. Silahkan coba lagi", variantAlert: "danger" };
    }

    

    await page.evaluate(() => {
      // Kartu Hasil Studi
      (document.querySelector("li:nth-child(4) > ul > li > a") as HTMLElement).click();
    });

    // ! KHS Page

    await page.waitForSelector("h5", {
      visible: true,
    });

    const semId = mahasiswa.semId;

    // Send Request according to semester id
    await page.evaluate((semId: string) => {
      console.log("wkwkwk");
      const http = new XMLHttpRequest();

      http.onreadystatechange = () => {
        if (http.readyState == XMLHttpRequest.DONE) {
          if (http.status == 200) {
            (document.querySelector("#response") as HTMLElement).innerHTML = http.response;
            console.log("hahah");
          } else {
            console.log("heheh");
          }
        }
      };

      http.open("POST", "/pmhskhs/loaddatas", true);
      http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      http.send(`semId=${semId}`);
    }, semId);

    // Wait for link has been visible

    await page.waitForSelector("#response a", {
      visible: true,
    }).then(() => console.log("Dapat Link"));

    // Get All the link to array

    const data = await page.evaluate(() => {
      const hrefs = document.querySelectorAll("#response a");

      const href = Array.from(hrefs).map((v) => v.getAttribute("href"));

      console.log(`hrefs ${hrefs}`);
      console.log(href);

      return href;
    });

    // Execute every kuesioner

    for await (const link of data) {
      const pageKHS = await browser.newPage();
      await pageKHS.goto(link);

      await pageKHS.waitForSelector("#sipform > div > ul > li > a", {
        visible: true,
      }).then(() => console.log("Udah di kuesioner"));

      // Get All tabs (ex: Kesiapan Mengajar, Materi Pengajaran, ...)
      const tabs = await pageKHS.evaluate(() => {
        const tabs = document.querySelectorAll("#sipform > div > ul > li > a");

        const tabArray = Array.from(tabs).map((v) => v.getAttribute("href"));

        return tabArray;
      });

      // Looping trough the tab
      for await (const tab of tabs) {
        if (tab === "#tabs0") continue;

        await pageKHS.click(`a[href="${tab}"]`);

        // Get all kuesioner in every tabs
        const names = await pageKHS.evaluate((tab: any) => {
          (document.querySelector(`a[href="${tab}"]`) as HTMLElement).click();

          const kuesioners = document.querySelectorAll("tbody tr td:last-child input");

          const kuesionerArray = Array.from(kuesioners).map((v) => v.getAttribute("name"));

          return kuesionerArray;
        }, tab);

        // ! Comment this line if youre ready
        if (tab === "#tabs8") {
          await pageKHS.type("textarea", "✌️");
          await pageKHS.evaluate(() => {
            (document.querySelector("#submit") as HTMLElement).click();
          });
          continue;
        }

        //* Check Radio button with random number from array nilai
        //* Comment loop below to test submit button button
        for await (const name of names) {

            const randomNumber = mahasiswa.nilai[Math.floor(Math.random() * mahasiswa.nilai.length)];

            await pageKHS.evaluate((name: any, randomNumber: string | undefined) => {
                (document.querySelector(`input[value="${randomNumber}"][name="${name}"`) as HTMLInputElement).checked = true;

            }, name, randomNumber);

        }
      }

      if (mahasiswa.cobaDulu) {
        break;
      }
    }

    await browser.close();

    return { response: "Berhasil!! Kuesioner Telah diisi 🎉🎉", variantAlert: "success" };
  } catch (e) {
    console.log(`e: ${e}, e.name: ${e.name}`);
    if (e.name == "TypeError") {
      return { response: "NIM dan Password tidak cocok. Silahkan coba lagi.", variantAlert: "danger" };
    }
    return { response: "❌Terlalu Lama untuk Request. Mungkin jaringan anda bermasalah. Silahkan Coba lagi ", variantAlert: "danger" };
  }
};
