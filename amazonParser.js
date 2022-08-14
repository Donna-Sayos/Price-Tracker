const nightmare = require("nightmare")();
// you have to require nightmare. Nighmare returns a function;
// remove all the extra information after the path in the url you're telling nightmare to go to;

const nodemailer = require("nodemailer");

const cron = require('node-cron'); // schedule tasks to be run on the server at a scheduled time;

// console.log(process.argv);
// process.exit(0);
const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

cron.schedule('* * * * *',async function checkPrice() {
    console.log('running every minute...')
    try {
      const item = await nightmare
        .goto(url)
        .wait(".a-price-whole")
        .evaluate(() => document.querySelector(".a-price-whole").innerText)
        .end();

      const itemPrice = Number(item);

      if (itemPrice < minPrice) {
        await sendEmail();
      };
    } catch (e) {
      await errorEmail(e);
      throw e
    }
});

const obj = {
  subject: "The price is low!",
  errorSub: "ERROR!",
  heading: "Hello daddy!",
  line1: `The price of the item on ${url} has dropped below $ ${minPrice} 😱!`,
  line2: "Better go and buy it as soon as you can before the price goes back to regular.",
  line3: "Please enjoy this photo of a corgi's butt.",
  imageUrl: "https://i.chzbgr.com/full/9441876224/h39F6DD50/wheel",
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

        <img src=${obj.imageUrl} alt="corgu_butt" />

        <h4 style="text-align:center">${obj.endNote}</h4>
      </body>
      </html>
`;

async function sendEmail() {
  const user = "donnasayos@gmail.com";
  const pass = "wbveycvcertlhnaa"; // not my actual password. It won't let you login to my gmail even if you tried lol;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // smtp is the main transport in nodemailer; Simple Mail Transport Protocol -- is used for sending out emails;
    port: 587, // default port nodemailer uses; 465 if you want to do bulk mailing;
    secure: false, // true for port 465, false for other ports; nodemailer uses TLS - Transport Layer Security (for privacy and data security for communications over the internet);
    auth: { // is what allows nodemailer to use my gmail to send out emails;
      user,
      pass 
    },
  });

  await transporter.sendMail({
    from: `"Your Amazon Price Tracker" <${user}>`, // sender address
    to: "sugarzaddy1234@gmail.com", // list of receivers
    subject: `${obj.subject}`, // Subject line
    // text: "Hello world?", // plain text body
    html: htmlTemplate, // html body
  });
  console.log("Email sent...💌")
};

async function errorEmail() {
  const user = "donnasayos@gmail.com";
  const pass = "wbveycvcertlhnaa";

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, 
    secure: false,
    auth: {
      user,
      pass 
    },
  });

  await transporter.sendMail({
    from: `"Your Amazon Price Tracker" <${user}>`,
    to: "sugarzaddy1234@gmail.com", 
    subject: `${obj.errorSub}`, 
    text: "There's an error in your Amazon price checker! 😱"
  });
  console.log("Error email sent...💌")
};

/* 
1.  we go to the url;
    we wait until the element is showing on the page;
    you will put the CSS selector of the element that holds the price point; # for id && . for class;
    we're evaluating some code which gives me the element with that class name, we usually just wants the text in that element on the HTML page which is the PRICE; */

/*
  everyday at midnight -->  0 0 * * *
*/ 