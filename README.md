# mint-site-merkle
This is a marktree implementation for use on the mint site.
Created to make addresses case-insensitive.

# How to use
`npm i mint-site-merkle`

## example

allowlist.js
```
export const types = ['address', 'uint248'];
export const lists = [
  ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 5],
  ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 5],
  ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 5],
];
```

main.js
```
import { MintSiteMerkle } from "mint-site-merkle";
import { types, lists } from "./allowlist";

...

  const merkle = new MintSiteMerkle(types, lists);
  console.log(merkle.getRootHash());

...

  const list = merkle.findList(blockchain.account);
  if (merkle.verify(list)) {
    ...
    contract.methods.mint(amount, list[1], merkle.getHexProof(list)).send(...);
  }
```

## important point
* The first column of the list should be address
* allowlist will be published externally
