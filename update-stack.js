const stdio = require('stdio');
const axios = require('axios');
const https = require('https');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});


/**
 * Update Stack
*/
async function updateStack(url, apikey, endpoint, stack) {
    try {

        console.log("get stack env ...");
        let stack_env = await axios({ 
            method: 'get', 
            url: `${url}/api/stacks/${stack}`, 
            headers: { 'X-API-Key': apikey },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        console.log("get stack file ...");
        let stack_file = await axios({ 
            method: 'get', 
            url: `${url}/api/stacks/${stack}/file`, 
            headers: { 'X-API-Key': apikey },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });


        console.log("update stack & repull image ...");
        let update = await axios({
            method: 'put',
            url: `${url}/api/stacks/${stack}?endpointId=${endpoint}`,
            headers: { 'X-API-Key': apikey, 'Content-Type': 'application/json' },
            data: JSON.stringify({
                "StackFileContent": stack_file.data.StackFileContent,
                "Env": stack_env.data.Env,
                "Prune": true,
                "PullImage": true
            }),
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        console.log(update.status);

    }
    catch (error) {
        console.log(error);
    }
}


/**
 * main
*/

var opts = stdio.getopt({
    'url':         {args: 1, description: 'Portainer URL', required: true, default: process.env.URL},
    'apikey':     {args: 1, description: 'Portainer API KEY', required: true, default: process.env.APIKEY},
    'endpoint': {args: 1, description: 'Portainer Endpoint', required: true, default: process.env.ENDPOINT},
    'stack':     {args: 1, description: 'Portainer Stack', required: true, default: process.env.STACK},
});

updateStack( opts.url, opts.apikey, opts.endpoint, opts.stack );
