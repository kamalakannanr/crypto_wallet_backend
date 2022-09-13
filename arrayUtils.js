
export function remove_zero_bal_quote(contract_list) {
    const filtered_contracts = contract_list.filter(
      (contract) => contract.balance > 0 && contract.quote > 0
    );
    return filtered_contracts;
  }
  
export function enrich_list_with_id(full_contract_list) {
    var i = 0;
    full_contract_list.forEach((element) => {
      element.id = i++;
      //console.log(element);
    });
    return full_contract_list;
  }