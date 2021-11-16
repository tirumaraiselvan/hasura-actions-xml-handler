const parseString = require('xml2js').parseString;
const stripPrefix = require('xml2js').processors.stripPrefix;
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const fs = require('fs')

let sampleActionHandler = async function sampleActionHandler(res) {
  fs.readFile('response.xml', 'utf8', (err, xml) => {
    if (err) {
      console.error(err)
      return
    }
    var samplexml = "<root>Hello xml2js!</root>"
    console.log(xml)

    parseString(xml,
      {
        tagNameProcessors: [stripPrefix]
        //      attrNameProcessors: [stripPrefix],
        //      valueProcessors: [stripPrefix],
        //      attrValueProcessors: [stripPrefix]
      },
      function (err, result) {
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
      });
  });
}


app.get('/:actionName', async (req, res) => {

  switch (req.params.actionName) {
    case 'sampleXML':
      sampleActionHandler(res);
      break;
    default:
      console.log('empty path value');
      res.send('empty path value');
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

