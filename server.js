"use strict";

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', function(req, res) {
  const url = 'http://nightly.changelog.com/2015/03/13/';

  request(url, function(error, response, html){
    if(error){
      res.send('Bad Request');
    }
    var $ = cheerio.load(html);
    let parent = $('.repositories').eq(1);
    let repos = [];

    $('.repository', parent).filter(function() {
      let repo = $(this);
      let link = $('h3 a', repo);
      let href = link.attr('href');
      let text = link.text();
      let arr = $('.stats p', repo).text().replace(/\s/g, '').split('·');

      let stats = {stars: arr[0], up: arr[1], type: arr[2]};

      repos.push({text, href, stats});
    });

    res.json(repos);
  });
});

app.listen('8081');
console.log('Server running on port 8081');
exports = module.exports = app;
