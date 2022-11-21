var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/* GET users listing. */
router.get("/hi/:query", function (req, res, next) {

    let arr = [];
    let website, title ,price,rating,imgurl;
    
    let headers = {
        headers: {
          Accept: "application/json",
          "User-Agent": "axios 0.21.1"
        }
      }
    
      //For AMAZON
      async function f(){
    
        const fpage  = await axios.get(`https://www.flipkart.com/search?q=${req.params.query}`); 
        // console.log(fpage.data);
        const a = cheerio.load(fpage.data);
        a('._3pLy-c').first().each((i, el) => {
           title = a(el).find('._4rR01T').text();
           price = a(el).find('._30jeq3').text();
           rating = a(el).find('._3LWZlK').text();
           website = "flipkart";
        });
        a('.MIXNux').first().each((i, el) => {
            imgurl = a(el).find('._396cs4').attr('src');
            console.log( imgurl );
        });
        
        let amazon={
            website : website,
            title : title,
        }
        console.log(amazon);
    
        arr.push({website, title ,price,rating,imgurl});
        const azpage = await axios.get(`https://www.amazon.in/s?k=${req.params.query}`,headers); 
        // console.log(azpage.data);
        ;
        const $ = cheerio.load(azpage.data);
        $('div[data-component-type="s-search-result"]').first().each((i, el) => {
          const title = $(el).find('.a-size-medium').text();
          const rating = $(el).find('.a-icon-alt').text();
          const price = $(el).find('.a-offscreen').text();
          const imgurl = $(el).find('.s-image').attr('src');
          const website = "amazon";
          arr.push(amazon,{ website,title,rating,price,imgurl});
          
        });
        console.log(arr)
        res.json(arr);
        }
      
        f();

});






module.exports = router;
