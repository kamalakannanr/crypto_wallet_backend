const http = require("http");

const host = '0.0.0.0';
const port = 8000;
const axios = require('axios');

const instance = axios.create({
    baseURL: "https://api.covalenthq.com/v1",
    headers: {'Content-type':'application/json',
            'user' : 'ckey_8b97951aade7408d8f0322e95f1:',
            'Authorization' : 'Basic Y2tleV84Yjk3OTUxYWFkZTc0MDhkOGYwMzIyZTk1ZjE6Og=='
}
})

var required_chain_ids = [137];//ethereum, fantom and polygon
var count = 0;
var positive_bal_contracts;
var chain_data_contracts= [];

 for(let i=0; i<required_chain_ids.length; i++)
 {
    console.log("chain id -" +required_chain_ids[i]);
    url = required_chain_ids[i] + "/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/";

    instance.get(url)
.then(function (response) {
    // handle success
   
    var respons_data_obj = JSON.parse(JSON.stringify(response.data));
    chain_data_contracts = chain_data_contracts.concat(respons_data_obj.data.items);
    console.log(" ")
    console.log(" ")
    console.log("Wallet balance for chain: "+ required_chain_ids[i]);
   /* for (let j=0; j<chain_data_contracts.length; j++)
    {
       console.log(chain_data_contracts[j].contract_name);
       var balance = chain_data_contracts[j].balance;
       //var native_token = chain_data_contracts[i].native_token;
       console.log(balance);
       //console.log(native_token);
       if(balance > 0)
       {
        //console.log(chain_data_contracts[i]);
       
        positive_bal_contracts[count] = chain_data_contracts[j];
        count++;
       }
    }*/
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
 }

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    console.log("request recieved and responded!")
    res.end(JSON.stringify(chain_data_contracts));
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

