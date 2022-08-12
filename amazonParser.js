const nightmare = require('nightmare')();
// you have to require nightmare. Nighmare returns a function;
// remove all the extra information after the path in the url you're telling nightmare to go to;

// console.log(process.argv)
const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

checkPrice()

async function checkPrice () {
    const itemPrice = await nightmare.goto(url)
                                     .wait(".a-price-whole")
                                     .evaluate(() => document.querySelector(".a-price-whole").innerText)
                                     .end()
    
    const currentPrice = Number(itemPrice)
    // console.log(currentPrice)
    // console.log(itemPrice)
    if (currentPrice < minPrice) {
        console.log("The item is cheap!!!", minPrice, currentPrice)
    } else {
        console.log("The item is still expensive!!!", minPrice, currentPrice)
    }
}

/* 
1.  we go to the url;
    we wait until the element is showing on the page;
    you will put the CSS selector of the element that holds the price point; # for id && . for class;
    we're evaluating some code which gives me the element with that class name, we usually just wants the text in that element on the HTML page which is the PRICE; */

/*
2.  We would need to take out the dollar sign so we can have just numbers, and then convert that string into a floating number;
*/