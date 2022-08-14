require("dotenv").config(); // this loads all of our environment variables into the process.env variable;

const nightmare = require("nightmare")();
// you have to require nightmare. Nighmare returns a function;
// remove all the extra information after the path in the url you're telling nightmare to go to;

const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const cron = require('node-cron'); // schedule tasks to be run on the server at a scheduled time;

// console.log(process.argv)
// process.exit(0)
const args = process.argv.slice(2);
const url1 = args[0];
const minPrice1 = args[1];

const url2 = args[2];
const minPrice2 = args[3];

checkPrice();
async function checkPrice() {
    console.log('running every minute...')
    try {
      const item1 = await nightmare
        .goto(url1)
        .wait(".a-price-whole")
        .evaluate(() => document.querySelector(".a-price-whole").innerText)
        .end();

      // const item2 = await nightmare
      //   .goto(url2)
      //   .wait(".a-price-whole")
      //   .evaluate(() => document.querySelector(".a-price-whole").innerText)
      //   .end();
  
      const item1Price = Number(item1);
      // const item2Price = Number(item2);
      
      // console.log(item1Price)
      // console.log(item2Price)
      if (item1Price < minPrice1) {
        await sendEmail1();
      };

      // if (item2Price < minPrice2) {
      //   await sendEmail2();
      // }
    } catch (e) {
      await sendEmail1("There's an error in your Amazon price checker! 😱", e);
      throw e
    }
};

const obj = {
  subject: "The price is low!",
  heading: "Hello daddy!",
  line1: `The price of the item on ${url1} has dropped below $ ${minPrice1} 😱!`,
  line: `The price of the item on ${url2} has dropped below $ ${minPrice2} 😱!`,
  line2: "Better go and buy it as soon as you can before the price goes back to regular.",
  line3: "Please enjoy this photo of a corgi's butt.",
  imageUrl: "https://i.chzbgr.com/full/9441876224/h39F6DD50/wheel",
  endNote: "Yours truly -- 💋💋",
};

let htmlTemplate = [`
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
`, `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>${obj.heading}</h1>

        <p>${obj.line}</p>
        <p>${obj.line2}</p>
        <p>${obj.line3}</p>

        <img src=${obj.imageUrl} alt="corgu_butt" />

        <h4 style="text-align:center">${obj.endNote}</h4>
      </body>
      </html>
`];

function sendEmail1() {
  const email = {
      to: {
        email: "donnasayos@gmail.com",
        name: "Donna Sayos",
      },
      subject: `${obj.subject}`,
      from: {
        email: "donnasayos@gmail.com",
        name: "Amazon Price Tracker",
      },
      content: [{ type: "text/html", value: htmlTemplate[0] }]
  };

  console.log(email);
  return sendGridMail.send(email);
};

// function sendEmail2() {
//   const email = {
//     to: {
//       email: "donnasayos@gmail.com",
//       name: "Donna Sayos",
//     },
//     subject: `${obj.subject}`,
//     from: {
//       email: "donnasayos@gmail.com",
//       name: "Amazon Price Tracker",
//     },
//     content: [{ type: "text/html", value: htmlTemplate[1] }]
//   };

//   console.log(email);
//   return sendGridMail.send(email);
// };

/* 
1.  we go to the url;
    we wait until the element is showing on the page;
    you will put the CSS selector of the element that holds the price point; # for id && . for class;
    we're evaluating some code which gives me the element with that class name, we usually just wants the text in that element on the HTML page which is the PRICE; */

/*
  everyday at midnight -->  0 0 * * *
*/

// cron.schedule('* * * * *', 