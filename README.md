# Crypto Wallet Backend

ExpressJS based http server that serves 2 APIs:

GET /all

Provides the balances of all contracts belonging to the 3 chains

1. Ethereum 
2. Polygon
3. Fantom

GET /chain/:id

Provides the balance of all the contracts of the given chain id.

The server uses Covalenthq APIs to fetch balances of contracts from multiple chains.
The server provides contracts for which balances and quotes are non-zero. It filters the contracts with 0 values.
For the 'all' API Axios Spread is used to concurrently fire the API towards Covalent and logic is present to aggregate the response.