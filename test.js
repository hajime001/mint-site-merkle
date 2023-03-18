import { expect }  from 'chai';
import { MintSiteMerkle } from "./index.js";

describe('merkle', function() {
    const types = ['address', 'uint256'];
    const al = [
        ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 5],
        ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 5],
        ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 5],
    ];
    const lowerAl = [
        ["0x5b38da6a701c568545dcfcb03fcb875f56beddc4", 5],
        ["0xab8483f64d9c6d1ecf9b849ae677dd3315835cb2", 5],
        ["0x4b20993bc481177ec7e8f571cecae8a9e22c02db", 5],
    ];
    const upperLowerMixAl = [
        ["0x5b38da6a701c568545dcfcb03fcb875f56beddc4", 5],
        ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 5],
        ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 5],
    ];

    it('rootHash', () => {
        const merkle = new MintSiteMerkle(types, al);

        expect(merkle.getRootHash()).to.be.equal('0xf8183e82d54d320809c75cabd271926605119eeff7f1fd7aa3a8fef7ff9a82ef');
    })

    it('main', () => {
        const merkle = new MintSiteMerkle(types, al);
        const address = al[0][0];

        expect(merkle.getHexProof(address)).to.be.eql([
            "0xe40f707d87626db2d479b31e2daab4fd8cf473c1e7e9486f886ff1c674f9837c",
            "0xf0bb8f3904c24136343b759ed9426d40529dd10478b0feb250a36126f3e4ebc3"
        ]);
        expect(merkle.verify(al[0])).to.be.true;
        expect(merkle.verify(al[1])).to.be.true;
        expect(merkle.verify(al[2])).to.be.true;
        expect(merkle.verify([al[0][0], 4])).to.be.false;
        expect(merkle.verify([])).to.be.false;
    })

    it('claimAddressが大文字小文字と小文字のみのproofが一致', () => {
        const merkle = new MintSiteMerkle(types, al);

        const claimingAddress = al[0][0];
        const proof1 = merkle.getHexProof(claimingAddress);
        const lowerClaimingAddress = lowerAl[0][0];
        const proof2 = merkle.getHexProof(lowerClaimingAddress);

        expect(proof1).to.be.eql(proof2);
    })

    it ('alに大文字小文字混じっていてもRootHashが一致', () => {
        const merkle = new MintSiteMerkle(types, al);
        const merkle2 = new MintSiteMerkle(types, lowerAl);
        const merkle3 = new MintSiteMerkle(types, upperLowerMixAl);

        expect(merkle.getRootHash()).to.be.equal(merkle2.getRootHash());
        expect(merkle2.getRootHash()).to.be.equal(merkle3.getRootHash());
    })

    it ('merkle外のアドレスを指定', () => {
        const merkle = new MintSiteMerkle(types, al);

        expect(merkle.getHexProof('0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB')).to.be.eql([]);
    })

    it ('リスト探索成功', () => {
        const merkle = new MintSiteMerkle(types, al);

        expect(merkle.findList(al[0][0])).to.be.eql(al[0]);
        expect(merkle.findList(al[1][0])).to.be.eql(al[1]);
        expect(merkle.findList(al[2][0])).to.be.eql(al[2]);

        expect(merkle.findList(lowerAl[0][0])).to.be.eql(lowerAl[0]);
        expect(merkle.findList(lowerAl[1][0])).to.be.eql(lowerAl[1]);
        expect(merkle.findList(lowerAl[2][0])).to.be.eql(lowerAl[2]);

        expect(merkle.findList(upperLowerMixAl[0][0])).to.be.eql(upperLowerMixAl[0]);
        expect(merkle.findList(upperLowerMixAl[1][0])).to.be.eql(upperLowerMixAl[1]);
        expect(merkle.findList(upperLowerMixAl[2][0])).to.be.eql(upperLowerMixAl[2]);
    })

    it ('リスト探索失敗', () => {
        const merkle = new MintSiteMerkle(types, al);

        expect(merkle.findList('0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB')).to.be.eql([]);
    })
})
