import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export class MintSiteMerkle {
    constructor(types, lists) {
        // example
        // types: ['address', 'uint256']
        // lists: [ ['0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 5], ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 5] ]
        for(let i = 0; i < lists.length; ++i) {
            lists[i][0] = ethers.utils.getAddress(lists[i][0]);
        }
        const leafNodes = lists.map(list => ethers.utils.solidityKeccak256(types, list));

        this.types = types;
        this.lists = lists;
        this.merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    }

    // exsample
    // list: ['0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 5]
    verify(list) {
        const adjustAddress = ethers.utils.getAddress(list[0]);

        return this.merkleTree.verify(this.getHexProof(adjustAddress), ethers.utils.solidityKeccak256(this.types, list), this.merkleTree.getRoot());
    }

    findList(address) {
        const adjustAddress = ethers.utils.getAddress(address);

        for(let i = 0; i < this.lists.length; ++i) {
            if(this.lists[i][0] === adjustAddress) {
                return this.lists[i];
            }
        }

        return [];
    }

    getRootHash() {
        return "0x" + this.merkleTree.getRoot().toString('hex');
    }

    getHexProof(address) {
        const adjustAddress = ethers.utils.getAddress(address);

        for(let i = 0; i < this.lists.length; ++i) {
            if (this.lists[i][0] === adjustAddress) {
                const claimingAddress = ethers.utils.solidityKeccak256(this.types, this.lists[i]);

                return this.merkleTree.getHexProof(claimingAddress);
            }
        }

        return [];
    }
}
