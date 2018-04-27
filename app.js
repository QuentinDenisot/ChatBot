require('dotenv').config();

var restify = require('restify'),
    builder = require('botbuilder'),
    server = restify.createServer();

server.listen(process.env.PORT, function(){
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId : process.env.MICROSOFT_APP_ID,
    appPassword : process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [
    function(session)
    {
        session.send('Hey !');
        //session.beginDialog('greetings', session.userData.profile);
        session.beginDialog('menu');
    }
    //,
    // function(session, results)
    // {
    //     if(!session.userData.profile)
    //     {
    //         session.userData.profile = results.response;
    //     }
    //     /*else
    //     {
    //         session.endConversation('Error ... existing conversation !!');
    //     }*/

    //     session.send(`hello ${results.response.name}`);
    // }
]).set('storage', inMemoryStorage);

var menuItems = {
    'Ironman': {
        item: 'dialogResultat'
    },
    'Thor': {
        item: 'dialogResultat'
    },
    'Hulk': {
        item: 'dialogResultat'
    },
    'Thanos': {
        item: 'dialogResultat'
    },
    'Spiderman': {
        item: 'dialogResultat'
    },
    'Doctor Strange': {
        item: 'dialogResultat'
    },
    'Star Lord': {
        item: 'dialogResultat'
    },
    'Vision': {
        item: 'dialogResultat'
    },
    'Captain America': {
        item: 'dialogResultat'
    },
    'Groot': {
        item: 'dialogResultat'
    }
};

var replayButton = {
    'Rejouer !': {
        item: 'menu'
    }
};

bot.dialog('menu', [
    function(session)
    {
        session.send('Tirage au sort aléatoire');
        session.send('Les probabilités sont différentes pour chaque option')
        builder.Prompts.choice(session, 'Devinez quel personnage est vivant à la fin du film Avengers Infinity War :', menuItems, {listStyle: 3});
    },
    function(session, results)
    {
        //permet de transformer le tableau json en un tableau indexé
        var indexedArray = [],
            i = 1;

        Object.keys(menuItems).forEach(function(key)
        {
            indexedArray.push([i] = key);
            i++;  
        })
        //console.log(indexedArray);

        var randomValue = getRandomInt(1, 100);
        //console.log(randomValue);

        //20% de chance d'obternir : Ironman
        if(randomValue > 0 && randomValue < 21)
        {
            selectedValue = 1;
        }
        //10% de chance d'obternir : Thor
        else if(randomValue > 20 && randomValue < 31)
        {
            selectedValue = 2;
        }
        //5% de chance d'obternir : Hulk
        else if(randomValue > 30 && randomValue < 36)
        {
            selectedValue = 3;
        }
        //5% de chance d'obternir : Thanos
        else if(randomValue > 35 && randomValue < 41)
        {
            selectedValue = 4;
        }
        //10% de chance d'obternir : Spiderman
        else if(randomValue > 40 && randomValue < 51)
        {
            selectedValue = 5;
        }
        //15% de chance d'obternir : Doctor Strange
        else if(randomValue > 50 && randomValue < 66)
        {
            selectedValue = 6;
        }
        //5% de chance d'obternir : Star Lord
        else if(randomValue > 65 && randomValue < 71)
        {
            selectedValue = 7;
        }
        //5% de chance d'obternir : Vision
        else if(randomValue > 70 && randomValue < 76)
        {
            selectedValue = 8;
        }
        //20% de chance d'obternir : Captain America
        else if(randomValue > 75 && randomValue < 96)
        {
            selectedValue = 9;
        }
        //5% de chance d'obternir : Groot
        else if(randomValue > 95 && randomValue < 101)
        {
            selectedValue = 10;
        }

        var choice = results.response.entity,
            item = menuItems[choice].item;
        //console.log(randomValue);
        //console.log(selectedValue);
        session.beginDialog(item, [choice, indexedArray]);
    }
]);

bot.dialog('dialogResultat', [
    function(session, results)
    {
        //si élément dans le tableau des perso à l'index aléatoire est != du perso sélectionné
        if(results[1][selectedValue - 1] != results[0])
        {
            session.send('Vous avez de la chance, ' + results[0] + ' n\'est pas mort !');
        }
        else
        {
            session.send('Pas de chance, ' + results[0] + ' est mort au combat !');
        }
        //console.log(results[1][selectedValue - 1]);
        //console.log(results[0]);

        builder.Prompts.choice(session, 'Vous voulez retenter votre chance ?', replayButton, {listStyle: 3});
    },
    function(session, results)
    {
        var choice = results.response.entity,
            item = replayButton[choice].item;

        session.beginDialog(item);
    }
]);

bot.dialog('greetings', [
    function(session, results, skip)
    {
        session.dialogData.profile = results || {};
        if(!session.dialogData.profile.name)
        {
            builder.Prompts.text(session, 'what is your name ?');
        }
        else
        {
            skip();
        }
    },
    function(session, results)
    {
        if(results.response)
        {
            session.dialogData.profile.name = results.response;
        }
        session.endDialogWithResult({ response : session.dialogData.profile });
    }
]);

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}