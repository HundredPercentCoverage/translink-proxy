var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();
const xml2js = require('xml-js');

router.get('/', function(req, res) {
  res.render('../views/index', {
    title: 'Translink Proxy'
  })
});

router.get('/stations', async function(req, res) {
  let fetchResult;

  await fetch('https://apis.opendatani.gov.uk/translink/')
    .then(results => {
      return results.json();
    }).then(data => {
      fetchResult = data.stations;
    }
  );
  
  res.append('Access-Control-Allow-Origin', '*');
  res.json(fetchResult);
});

router.get('/station/:code', async function(req, res) {
  let jsonResult;

  await fetch(`https://apis.opendatani.gov.uk/translink/${req.params.code}.xml`).then(response => {
    return response.text();
  }).then(xml => {
    jsonResult = JSON.parse(
      xml2js.xml2json(xml, {
        compact: true,
        textKey: "_",
        attributesKey: "$",
        commentKey: "value"
      })
    );
  });

  res.append('Access-Control-Allow-Origin', '*');
  res.json(jsonResult);
});

module.exports = router;
