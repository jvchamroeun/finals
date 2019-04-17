const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const bodyParser = require('body-parser');

var app = express();
const fs = require('fs');


var utils = require('./utils');
const port = process.env.PORT || 8080;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


hbs.registerPartials(__dirname);

app.set('view engine', 'hbs');
app.use(express.static(__dirname ));


app.post('/input', async (request, response) => {
    var input = request.body.query;
    JSON.stringify(input);
    var images = await getAPI1(input);
    response.render('main.hbs', {
        output: images
    });
});

var getAPI1 = async (input) => {

    try {
        var url = await axios.get(`https://images-api.nasa.gov/search?q=${input}`);
        var hits = url.data.collection.metadata.total_hits;
        var data = url.data.collection.items;
        var images = [];
        var i;
        console.log(hits);
        if(hits === 0){
            throw new Error('There are zero hits for this search');
        } else {
            for (i = 0; i < 10; i++) {
                images.push(data[i].links[0].href);
            }
            return images;

        }

    } catch (err) {
        return err
    }
};


app.get('/', (request, response) => {
    response.render('main.hbs', {
        title: "Home Page",
        header: "Welcome to Home!"
    });
});

app.get('/404', (request, response) => {
    response.send({error: 'Page not found'})
});


// app.post('/input', (request, response)=> {
//     var user_input = request.body;
//     var user_input = JSON.stringify((user_input.user))
//     console.log(user_input);
//
//     response.render('main.hbs', {
//         output: user_input
//     })
// });

app.listen(port, () => {
    console.log('Server is up on the port 8080')
});