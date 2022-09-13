const http = require("http");

const express = require("express");
const app = express();

const host = "0.0.0.0";
const port = 8000;
const axios = require("axios");

const instance = axios.create({
  baseURL: "https://api.covalenthq.com/v1",
  headers: {
    "Content-type": "application/json",
    user: "ckey_8b97951aade7408d8f0322e95f1:",
    Authorization: "Basic Y2tleV84Yjk3OTUxYWFkZTc0MDhkOGYwMzIyZTk1ZjE6Og==",
  },
});

var required_chain_ids = [1, 250, 137]; //ethereum, fantom and polygon
var wallet_address = "0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50";

app.get("/all", (req, res) => {
  var axios_gets = [];
  for (let i = 0; i < required_chain_ids.length; i++) {
    console.log("chain id -" + required_chain_ids[i]);
    url =
      required_chain_ids[i] + "/address/" + wallet_address + "/balances_v2/";
    axios_gets[i] = instance.get(url);
  }
  axios
    .all(axios_gets)
    .then(
      axios.spread((...responses) => {
        var chain_data_contracts = [];
        for (let i = 0; i < responses.length; i++) {
          //console.log(responses[i].data);
          var response_data_json = JSON.parse(
            JSON.stringify(responses[i].data)
          );
          const filtered_contracts = remove_zero_bal_quote(
            response_data_json.data.items
          );
          // console.log(filtered_contracts);
          chain_data_contracts =
            chain_data_contracts.concat(filtered_contracts);
        }
        enrich_list_with_id(chain_data_contracts);
        console.log("responses combined");
        res.setHeader("Content-Type", "application/json");
        res.send(chain_data_contracts);
      })
    )
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});

app.get("/chain/:id", (req, res) => {
  var id = req.params.id;
  const url = id + "/address/" + wallet_address + "/balances_v2/";

  instance
    .get(url)
    .then(function (response) {
      var response_data_json = JSON.parse(JSON.stringify(response.data));
      var full_contract_list = response_data_json.data.items;
      var filtered_contracts = enrich_list_with_id(
        remove_zero_bal_quote(full_contract_list)
      );
      //console.log(filtered_contracts);
      res.setHeader("Content-Type", "application/json");
      res.send(filtered_contracts);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function remove_zero_bal_quote(contract_list) {
  const filtered_contracts = contract_list.filter(
    (contract) => contract.balance > 0 && contract.quote > 0
  );
  return filtered_contracts;
}

function enrich_list_with_id(full_contract_list) {
  var i = 0;
  full_contract_list.forEach((element) => {
    element.id = i++;
    //console.log(element);
  });
  return full_contract_list;
}
