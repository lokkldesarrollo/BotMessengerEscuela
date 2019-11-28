const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const app = express().use(bodyParser.json());
const path = require('path');


const PAGE_ACESS_TOKEN = process.env.PAGE_ACESS_TOKEN;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/webhook', (req, res) => {
    console.log('POST: webhook');

    const body = req.body;

    if (body.object === 'page') {

        body.entry.forEach(entry => {
            // se reciben y procesan los mensajes
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);

            const sender_psid = webhookEvent.sender.id;
            console.log('Sender PSID: ${sender_psid}');

            // validar que estamos recibiendo un mensaje

            if(webhookEvent.mensaje) {
                handleMessage(sender_psid,webhookEvent,message);
            }else if(webhook.postback ){
                handlePostback(sender_psid,webhookEvent.postback)
            }
        });

        res.status(200).send('EVENTO RECIBIDO');
    } else {
        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {
    console.log('__________________________________________________________')
    console.log('GET: webhook');

    const VERIFY_TOKEN = 'stringUnicoParaTuAplicacion';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK VERIFICADO');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

function handleMessage(sender_psid, received_message){
    let response;

    if(received_message.text){
        response = {
            'text': 'Tu mensaje fue ${received_message.text}'
        }
    }//end if

    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback){
    
}



function callSendAPI(sender_psid, response){

    const requestBody = {
         'recipient': {
            'id' : sender_psid
         },
         'message' : response 
    };

   request({
        'uri':'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token' : 'EAAIwO6sfsoMBAInFXjU2jZBBpM7sxtB2vS7l9CVh2WjZC4M2S7HgZBHrfPj6kyCJf4c2E6qGpFx1ZBKvDog5756oOzfOMQKiXbzOeRmYxN0OUAtcs0W4bj5POAeshfhynOZAzPLZCNxjS6wDTfF292LAqzA8QNe4gPA5ioibooGFEHA01LwMK9O0BdPpcEUqEZD'},
        'method': 'POST',
        'json': requestBody
    }, (err,res, body) => {
        if(!err){
            console.log('Mensaje enviado de vuelta');
        }else{
            console.log('No se pudo enviar');
        }
    });

    
}


app.listen(process.env.PORT || 4000, function() {
    console.log('Your node js server is running');
});