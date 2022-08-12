require("dotenv").config(); // this loads all of our environment variables into the process.env variable;

const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const nightmare = require("nightmare")();
// you have to require nightmare. Nighmare returns a function;
// remove all the extra information after the path in the url you're telling nightmare to go to;

// console.log(process.argv)
// process.exit(0)
const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

checkPrice();

async function checkPrice() {
  try {
    const itemPrice = await nightmare
      .goto(url)
      .wait(".a-price-whole")
      .evaluate(() => document.querySelector(".a-price-whole").innerText)
      .end();

    const currentPrice = Number(itemPrice);
    // console.log(currentPrice)
    // console.log(itemPrice)
    if (currentPrice < minPrice) {
      await sendEmail(
        "The price is low!",
        `The price of the item on ${url} has dropped below $ ${minPrice} 😱!`
      );
    }
  } catch (e) {
    await sendEmail("There's an error in your Amazon price checker! 😱", e.message);
    throw e
  }
}

function sendEmail(subject, body) {
  const email = {
    to: "donnasayos@gmail.com",
    from: "donnasayos@gmail.com",
    subject: subject,
    text: body,
    html: body,
  };
  console.log(email);
  return sendGridMail.send(email);
}

/* 
1.  we go to the url;
    we wait until the element is showing on the page;
    you will put the CSS selector of the element that holds the price point; # for id && . for class;
    we're evaluating some code which gives me the element with that class name, we usually just wants the text in that element on the HTML page which is the PRICE; */
