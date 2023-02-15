import { ethers } from 'ethers';
import { MerkleTree} from 'merkletreejs';
import keccak256 from 'keccak256';

export class MintSiteMerkle {
    constructor(types, lists) {
        // example
        // types: ['address', 'uint256']
        // lists: [ ['0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 5], ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 5] ]
        for(let i = 0; i < lists.length; ++i) {
            lists[i][0] = ethers.getAddress(lists[i][0]);
        }
        const leafNodes = lists.map(list => ethers.solidityPackedKeccak256(types, list));

        this.types = types;
        this.lists = lists;
        this.merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    }

    displayRootHash() {
        return "Root Hash: " + "0x" + this.merkleTree.getRoot().toString('hex');
    }

    verify(values) {
        values[0] = ethers.getAddress(values[0]);

        return this.merkleTree.verify(this.getHexProof(values[0]), ethers.solidityPackedKeccak256(this.types, values), this.merkleTree.getRoot());
    }

    getHexProof(address) {
        const adjustAddress = ethers.getAddress(address);

        for(let i = 0; i < this.lists.length; ++i) {
            if (this.lists[i][0] === adjustAddress) {
                const claimingAddress = ethers.solidityPackedKeccak256(this.types, this.lists[i]);

                return this.merkleTree.getHexProof(claimingAddress);
            }
        }

        return [];
    }
}
