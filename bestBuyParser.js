require("dotenv").config();

const puppeteer = require("puppeteer");

const nodemailer = require("nodemailer");
const cron = require("node-cron"); // schedule tasks to be run on the server at a scheduled time;

const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

// Headless:true runs puppeteer in the background without opening a new browser page in contrast Headless: false opens a new browser page for you to see the process running

cron.schedule("* * * * *", async function checkPrice() {
  console.log("running every minute...");
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(5000);
    // await page.screenshot({ path: "bestBuy_snapshot.png" });

    const price = await page.evaluate(() => {
      const coinPrice = document.querySelector(
        ".priceView-hero-price.priceView-customer-price span"
      ).innerHTML;
      const numberPrice = parseFloat(coinPrice.slice(1).replace(",", ""));

      return numberPrice;
    });

    console.log(price);
    await browser.close();

    if (price < minPrice) {
      await sendEmail();
    }
  } catch (e) {
    await errorEmail(e);
    throw e;
  }
});

const obj = {
  subject: "The price is low!",
  errorSub: "ERROR!",
  heading: "Hello daddy!",
  line1: `The price of the cryptocurrency on ${url} has dropped below $ ${minPrice} 😱!`,
  line2:
    "Better go and buy it as soon as you can before the price goes back up!",
  line3:
    "Please enjoy this gif while you're contemplating on whether to buy the coin or not.",
  imageUrl:
    "https://ih1.redbubble.net/image.1301189864.6168/flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
  endNote: "Yours truly -- 💋💋",
};

let htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>${obj.heading}</h1>

        <p>${obj.line1}</p>
        <p>${obj.line2}</p>
        <p>${obj.line3}</p>

        <img src=${obj.imageUrl} alt="bouncy_butt" />

        <h4 style="text-align:center">${obj.endNote}</h4>
      </body>
      </html>
`;

async function sendEmail() {
  const user = "donnasayos@gmail.com";
  const pass = process.env.SECRET_PASS;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"Your Amazon Price Tracker" <${user}>`,
    to: "sugarzaddy1234@gmail.com",
    subject: `${obj.subject}`,
    html: htmlTemplate,
  });
  console.log("Email sent...💌");
}

async function errorEmail() {
  const user = "donnasayos@gmail.com";
  const pass = process.env.SECRET_PASS;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"Your Amazon Price Tracker" <${user}>`,
    to: "sugarzaddy1234@gmail.com",
    subject: `${obj.errorSub}`,
    text: "There's an error in your Amazon price checker! 😱",
  });
  console.log("Error email sent...💌");
}