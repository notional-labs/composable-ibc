const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("MMR contract", function () {
  let mpt;
  let MPTWrapper;
  let owner;
  let testValues: any;

  async function createMPT() {
    //const MPTLibContract = await ethers.getContractFactory("MPT");
    //const MPTlib = await MPTLibContract.deploy();
    //MPTWrapper = await ethers.getContractFactory("MPTWrapper", {
    //});
    //const mptNew = await MPTWrapper.deploy();
    //return mptNew;
    /*
    const TrieProofsLibContract = await ethers.getContractFactory("TrieProofs");
    const TrieProofsLib = await TrieProofsLibContract.deploy();
    const TrieProofWrapper = await ethers.getContractFactory("TrieProofsWrapper", {
      libraries: {
      }
    });
    const mptNew = await TrieProofWrapper.deploy();
    return mptNew;
    */
    const NibbleSlice = await ethers.getContractFactory("NibbleSlice");
    const nibbleSlice = await NibbleSlice.deploy();
    //const Option = await ethers.getContractFactory("Option");
    //const option = await Option.deploy();
    const TrieDB = await ethers.getContractFactory("TrieDB");
    const trieDB = await TrieDB.deploy();
    const NodeCodec = await ethers.getContractFactory("NodeCodec");
    const nodeCodec = await NodeCodec.deploy();
    //const EthereumTrieDB = await ethers.getContractFactory("EthereumTrieDB");
    //const ethereumTrieDB = await EthereumTrieDB.deploy();
    //const SubstrateTrieDB = await ethers.getContractFactory("SubstrateTrieDB");
    //const substrateTrieDB = await SubstrateTrieDB.deploy();

    const MerklePatricia = await ethers.getContractFactory("LookUp",
    {
      libraries: {
        NibbleSlice:  nibbleSlice.address,
        //Option: option.address,
        TrieDB: trieDB.address,
        //EthereumTrieDB: ethereumTrieDB.address,
        //SubstrateTrieDB: substrateTrieDB.address
        NodeCodec: nodeCodec.address
      }
    });
    const merklePatricia = await MerklePatricia.deploy();
    const MPTWrapper = await ethers.getContractFactory("MPTWrapper", {
      libraries: {
        LookUp: merklePatricia.address
      }
    });
    const mptNew = await MPTWrapper.deploy();
    return mptNew
  }

  it.only("Should verify correctly mpt tree", async function () {
    mpt = await createMPT();
    const proofs = [
      [
        63, 67, 99, 107, 115, 47, 112, 111, 114, 116, 115, 47, 116, 114, 97,
        110, 115, 102, 101, 114, 47, 99, 104, 97, 110, 110, 101, 108, 115, 47,
        99, 104, 97, 110, 110, 101, 108, 45, 48, 47, 115, 101, 113, 117, 101,
        110, 99, 101, 115, 47, 49, 31, 250, 210, 72, 177, 118, 229, 126, 167,
        98, 26, 245, 63, 121, 138, 163, 51, 231, 210, 44, 228, 205, 100, 75, 15,
        68, 132, 77, 78, 255, 180, 103,
      ],
      [
        112, 105, 108, 100, 95, 115, 116, 111, 114, 97, 103, 101, 58, 100, 101,
        102, 97, 117, 108, 116, 58, 105, 98, 99, 47, 128, 182, 54, 58, 34, 8,
        28, 65, 172, 39, 0, 30, 196, 130, 177, 181, 62, 116, 165, 104, 72, 110,
        121, 145, 223, 178, 237, 110, 187, 20, 25, 213, 238,
      ],
      [
        128, 0, 129, 128, 191, 57, 221, 248, 213, 222, 54, 96, 164, 55, 152,
        100, 101, 122, 44, 227, 51, 89, 197, 148, 145, 18, 246, 112, 24, 61,
        187, 214, 29, 66, 19, 255, 128, 238, 148, 146, 232, 177, 199, 209, 20,
        93, 72, 156, 249, 192, 231, 179, 67, 107, 4, 68, 234, 129, 21, 67, 117,
        89, 229, 216, 120, 94, 187, 147, 143,
      ],
      [
        128, 0, 148, 128, 179, 182, 80, 68, 237, 32, 157, 18, 142, 139, 142, 63,
        177, 173, 218, 55, 176, 154, 242, 201, 180, 209, 218, 197, 171, 200, 28,
        20, 107, 121, 10, 207, 128, 17, 78, 197, 91, 24, 39, 147, 69, 62, 215,
        177, 182, 183, 202, 21, 234, 232, 116, 5, 119, 131, 136, 201, 56, 150,
        185, 169, 188, 155, 17, 176, 241, 128, 231, 194, 202, 163, 29, 155, 21,
        95, 236, 57, 155, 217, 202, 90, 90, 107, 103, 112, 195, 150, 54, 187,
        58, 68, 175, 214, 58, 102, 144, 199, 190, 34,
      ],
      [
        128, 10, 64, 128, 217, 119, 63, 116, 116, 207, 127, 171, 43, 127, 151,
        151, 77, 28, 15, 56, 159, 152, 41, 18, 147, 178, 73, 108, 230, 6, 94,
        28, 218, 150, 200, 25, 128, 137, 202, 10, 148, 29, 237, 27, 245, 31, 34,
        220, 142, 71, 93, 56, 239, 9, 111, 22, 78, 214, 251, 162, 39, 74, 62,
        236, 224, 158, 145, 156, 15, 128, 177, 127, 120, 183, 155, 179, 49, 119,
        229, 139, 230, 156, 206, 77, 100, 46, 12, 45, 249, 163, 143, 131, 0, 73,
        28, 62, 151, 119, 231, 177, 50, 195,
      ],
      [
        128, 93, 77, 192, 206, 26, 181, 209, 4, 199, 196, 149, 92, 150, 197,
        142, 197, 158, 150, 181, 63, 186, 104, 108, 31, 74, 69, 160, 8, 2, 35,
        102, 207,
      ],
      [
        128, 255, 252, 128, 138, 102, 193, 144, 82, 173, 209, 58, 32, 43, 205,
        115, 181, 70, 174, 12, 183, 5, 68, 241, 102, 196, 164, 105, 103, 44,
        102, 111, 10, 95, 157, 138, 128, 208, 74, 1, 177, 205, 195, 120, 157,
        168, 101, 4, 147, 253, 118, 189, 166, 89, 235, 143, 247, 8, 146, 212,
        190, 60, 212, 27, 164, 113, 92, 235, 33, 128, 82, 254, 156, 173, 5, 206,
        177, 89, 207, 69, 158, 139, 51, 55, 64, 185, 241, 220, 233, 97, 94, 167,
        250, 251, 230, 32, 8, 123, 253, 155, 20, 24, 128, 169, 55, 235, 3, 105,
        181, 68, 127, 81, 25, 225, 20, 102, 63, 51, 172, 45, 105, 212, 2, 8,
        152, 9, 109, 30, 141, 3, 177, 154, 10, 45, 129, 128, 226, 108, 214, 38,
        48, 202, 188, 78, 240, 103, 174, 180, 17, 92, 112, 102, 192, 163, 82,
        170, 15, 68, 253, 1, 23, 190, 76, 196, 71, 169, 133, 91, 128, 174, 103,
        155, 44, 207, 74, 208, 22, 147, 28, 162, 41, 162, 86, 208, 120, 201, 15,
        17, 39, 101, 241, 79, 249, 148, 173, 160, 222, 100, 25, 116, 178, 128,
        218, 65, 185, 83, 0, 88, 206, 96, 227, 186, 242, 53, 213, 73, 245, 68,
        62, 113, 190, 17, 178, 194, 74, 98, 159, 82, 156, 21, 142, 68, 172, 143,
        128, 65, 254, 163, 57, 215, 69, 193, 59, 81, 0, 22, 38, 164, 206, 87,
        236, 84, 80, 25, 249, 91, 211, 78, 102, 124, 34, 239, 196, 182, 72, 140,
        137, 128, 90, 221, 200, 78, 104, 235, 32, 131, 219, 213, 174, 250, 139,
        240, 25, 70, 95, 233, 18, 247, 141, 90, 97, 143, 227, 238, 129, 148,
        212, 63, 187, 44, 128, 205, 12, 157, 85, 111, 238, 228, 105, 110, 110,
        100, 106, 27, 128, 147, 75, 156, 127, 255, 146, 30, 250, 33, 51, 4, 196,
        164, 3, 223, 28, 85, 118, 128, 78, 31, 212, 117, 68, 159, 212, 98, 62,
        206, 57, 70, 34, 69, 83, 193, 47, 10, 93, 138, 231, 231, 76, 47, 46, 33,
        167, 69, 38, 238, 50, 133, 128, 209, 24, 77, 106, 103, 131, 152, 28,
        196, 75, 250, 189, 227, 84, 45, 229, 105, 74, 135, 101, 116, 239, 210,
        135, 223, 139, 24, 63, 59, 219, 56, 172, 128, 73, 106, 20, 202, 50, 104,
        3, 101, 181, 146, 141, 111, 126, 148, 186, 244, 31, 88, 116, 154, 168,
        84, 73, 143, 171, 95, 44, 179, 215, 32, 7, 63, 128, 21, 225, 196, 167,
        186, 53, 149, 60, 188, 102, 58, 77, 3, 225, 200, 187, 110, 62, 167, 113,
        209, 156, 114, 118, 235, 2, 127, 31, 213, 25, 78, 246,
      ],
      [
        136, 105, 98, 99, 47, 192, 0, 128, 247, 78, 160, 9, 175, 101, 85, 170,
        38, 199, 178, 252, 64, 30, 203, 91, 213, 60, 215, 198, 243, 72, 116,
        244, 185, 149, 241, 169, 237, 41, 21, 70, 128, 252, 24, 115, 3, 227, 68,
        164, 85, 46, 90, 230, 123, 245, 240, 91, 45, 63, 67, 163, 207, 96, 77,
        178, 26, 134, 184, 1, 9, 150, 138, 249, 183,
      ],
      [
        194, 99, 64, 0, 0, 128, 227, 40, 139, 217, 134, 2, 153, 102, 171, 235,
        196, 93, 68, 99, 85, 160, 81, 72, 223, 111, 87, 51, 237, 27, 199, 160,
        177, 177, 53, 195, 178, 64,
      ],
    ];

    const key = 
      [
        105, 98, 99, 47, 97, 99, 107, 115, 47, 112, 111, 114, 116, 115, 47, 116,
        114, 97, 110, 115, 102, 101, 114, 47, 99, 104, 97, 110, 110, 101, 108,
        115, 47, 99, 104, 97, 110, 110, 101, 108, 45, 48, 47, 115, 101, 113,
        117, 101, 110, 99, 101, 115, 47, 49,
      ]
    ;
    let storageProof = [
      36, 77, 1, 63, 67, 99, 107, 115, 47, 112, 111, 114, 116, 115, 47, 116,
      114, 97, 110, 115, 102, 101, 114, 47, 99, 104, 97, 110, 110, 101, 108,
      115, 47, 99, 104, 97, 110, 110, 101, 108, 45, 48, 47, 115, 101, 113, 117,
      101, 110, 99, 101, 115, 47, 49, 31, 250, 210, 72, 177, 118, 229, 126, 167,
      98, 26, 245, 63, 121, 138, 163, 51, 231, 210, 44, 228, 205, 100, 75, 15,
      68, 132, 77, 78, 255, 180, 103, 232, 112, 105, 108, 100, 95, 115, 116,
      111, 114, 97, 103, 101, 58, 100, 101, 102, 97, 117, 108, 116, 58, 105, 98,
      99, 47, 128, 182, 54, 58, 34, 8, 28, 65, 172, 39, 0, 30, 196, 130, 177,
      181, 62, 116, 165, 104, 72, 110, 121, 145, 223, 178, 237, 110, 187, 20,
      25, 213, 238, 21, 1, 128, 0, 129, 128, 191, 57, 221, 248, 213, 222, 54,
      96, 164, 55, 152, 100, 101, 122, 44, 227, 51, 89, 197, 148, 145, 18, 246,
      112, 24, 61, 187, 214, 29, 66, 19, 255, 128, 238, 148, 146, 232, 177, 199,
      209, 20, 93, 72, 156, 249, 192, 231, 179, 67, 107, 4, 68, 234, 129, 21,
      67, 117, 89, 229, 216, 120, 94, 187, 147, 143, 153, 1, 128, 0, 148, 128,
      179, 182, 80, 68, 237, 32, 157, 18, 142, 139, 142, 63, 177, 173, 218, 55,
      176, 154, 242, 201, 180, 209, 218, 197, 171, 200, 28, 20, 107, 121, 10,
      207, 128, 17, 78, 197, 91, 24, 39, 147, 69, 62, 215, 177, 182, 183, 202,
      21, 234, 232, 116, 5, 119, 131, 136, 201, 56, 150, 185, 169, 188, 155, 17,
      176, 241, 128, 231, 194, 202, 163, 29, 155, 21, 95, 236, 57, 155, 217,
      202, 90, 90, 107, 103, 112, 195, 150, 54, 187, 58, 68, 175, 214, 58, 102,
      144, 199, 190, 34, 153, 1, 128, 10, 64, 128, 217, 119, 63, 116, 116, 207,
      127, 171, 43, 127, 151, 151, 77, 28, 15, 56, 159, 152, 41, 18, 147, 178,
      73, 108, 230, 6, 94, 28, 218, 150, 200, 25, 128, 137, 202, 10, 148, 29,
      237, 27, 245, 31, 34, 220, 142, 71, 93, 56, 239, 9, 111, 22, 78, 214, 251,
      162, 39, 74, 62, 236, 224, 158, 145, 156, 15, 128, 177, 127, 120, 183,
      155, 179, 49, 119, 229, 139, 230, 156, 206, 77, 100, 46, 12, 45, 249, 163,
      143, 131, 0, 73, 28, 62, 151, 119, 231, 177, 50, 195, 132, 128, 93, 77,
      192, 206, 26, 181, 209, 4, 199, 196, 149, 92, 150, 197, 142, 197, 158,
      150, 181, 63, 186, 104, 108, 31, 74, 69, 160, 8, 2, 35, 102, 207, 69, 7,
      128, 255, 252, 128, 138, 102, 193, 144, 82, 173, 209, 58, 32, 43, 205,
      115, 181, 70, 174, 12, 183, 5, 68, 241, 102, 196, 164, 105, 103, 44, 102,
      111, 10, 95, 157, 138, 128, 208, 74, 1, 177, 205, 195, 120, 157, 168, 101,
      4, 147, 253, 118, 189, 166, 89, 235, 143, 247, 8, 146, 212, 190, 60, 212,
      27, 164, 113, 92, 235, 33, 128, 82, 254, 156, 173, 5, 206, 177, 89, 207,
      69, 158, 139, 51, 55, 64, 185, 241, 220, 233, 97, 94, 167, 250, 251, 230,
      32, 8, 123, 253, 155, 20, 24, 128, 169, 55, 235, 3, 105, 181, 68, 127, 81,
      25, 225, 20, 102, 63, 51, 172, 45, 105, 212, 2, 8, 152, 9, 109, 30, 141,
      3, 177, 154, 10, 45, 129, 128, 226, 108, 214, 38, 48, 202, 188, 78, 240,
      103, 174, 180, 17, 92, 112, 102, 192, 163, 82, 170, 15, 68, 253, 1, 23,
      190, 76, 196, 71, 169, 133, 91, 128, 174, 103, 155, 44, 207, 74, 208, 22,
      147, 28, 162, 41, 162, 86, 208, 120, 201, 15, 17, 39, 101, 241, 79, 249,
      148, 173, 160, 222, 100, 25, 116, 178, 128, 218, 65, 185, 83, 0, 88, 206,
      96, 227, 186, 242, 53, 213, 73, 245, 68, 62, 113, 190, 17, 178, 194, 74,
      98, 159, 82, 156, 21, 142, 68, 172, 143, 128, 65, 254, 163, 57, 215, 69,
      193, 59, 81, 0, 22, 38, 164, 206, 87, 236, 84, 80, 25, 249, 91, 211, 78,
      102, 124, 34, 239, 196, 182, 72, 140, 137, 128, 90, 221, 200, 78, 104,
      235, 32, 131, 219, 213, 174, 250, 139, 240, 25, 70, 95, 233, 18, 247, 141,
      90, 97, 143, 227, 238, 129, 148, 212, 63, 187, 44, 128, 205, 12, 157, 85,
      111, 238, 228, 105, 110, 110, 100, 106, 27, 128, 147, 75, 156, 127, 255,
      146, 30, 250, 33, 51, 4, 196, 164, 3, 223, 28, 85, 118, 128, 78, 31, 212,
      117, 68, 159, 212, 98, 62, 206, 57, 70, 34, 69, 83, 193, 47, 10, 93, 138,
      231, 231, 76, 47, 46, 33, 167, 69, 38, 238, 50, 133, 128, 209, 24, 77,
      106, 103, 131, 152, 28, 196, 75, 250, 189, 227, 84, 45, 229, 105, 74, 135,
      101, 116, 239, 210, 135, 223, 139, 24, 63, 59, 219, 56, 172, 128, 73, 106,
      20, 202, 50, 104, 3, 101, 181, 146, 141, 111, 126, 148, 186, 244, 31, 88,
      116, 154, 168, 84, 73, 143, 171, 95, 44, 179, 215, 32, 7, 63, 128, 21,
      225, 196, 167, 186, 53, 149, 60, 188, 102, 58, 77, 3, 225, 200, 187, 110,
      62, 167, 113, 209, 156, 114, 118, 235, 2, 127, 31, 213, 25, 78, 246, 37,
      1, 136, 105, 98, 99, 47, 192, 0, 128, 247, 78, 160, 9, 175, 101, 85, 170,
      38, 199, 178, 252, 64, 30, 203, 91, 213, 60, 215, 198, 243, 72, 116, 244,
      185, 149, 241, 169, 237, 41, 21, 70, 128, 252, 24, 115, 3, 227, 68, 164,
      85, 46, 90, 230, 123, 245, 240, 91, 45, 63, 67, 163, 207, 96, 77, 178, 26,
      134, 184, 1, 9, 150, 138, 249, 183, 152, 194, 99, 64, 0, 0, 128, 227, 40,
      139, 217, 134, 2, 153, 102, 171, 235, 196, 93, 68, 99, 85, 160, 81, 72,
      223, 111, 87, 51, 237, 27, 199, 160, 177, 177, 53, 195, 178, 64]

    let storageProofInHex = "0x" + Buffer.from(storageProof).toString('hex');
    const hexProof = proofs.map((proof) => "0x" + Buffer.from(proof).toString('hex'));
    console.log(hexProof);

    const hexKey = "0x" + Buffer.from(key).toString('hex')
    console.log(hexKey);
    const keyHash = ethers.utils.keccak256(key);


    const state_root = "0xea8e38bc20538828c8a9465445be480d4faf7dc96e0f77dfacb97d1324614e65";

    console.log(423);
    console.log(storageProofInHex);
    console.log(state_root);
    console.log(hexKey);
    console.log(keyHash);
    //const keys = ["0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb"];
    //const pproofs = [
    //    "0x802e98809b03c6ae83e3b70aa89acfe0947b3a18b5d35569662335df7127ab8fcb88c88780e5d1b21c5ecc2891e3467f6273f27ce2e73a292d6b8306197edfa97b3d965bd080c51e5f53a03d92ea8b2792218f152da738b9340c6eeb08581145825348bbdba480ad103a9320581c7747895a01d79d2fa5f103c4b83c5af10b0a13bc1749749523806eea23c0854ced8445a3338833e2401753fdcfadb3b56277f8f1af4004f73719806d990657a5b5c3c97b8a917d9f153cafc463acd90592f881bc071d6ba64e90b380346031472f91f7c44631224cb5e61fb29d530a9fafd5253551cbf43b7e97e79a",
    //    "0x9f00c365c3cf59d671eb72da0e7a4113c41002505f0e7b9012096b41c4eb3aaf947f6ea429080000685f0f1f0515f462cdcf84e0f1d6045dfcbb2035e90c7f86010000"
    //];
    //const root = "0x6b5710000eccbd59b6351fc2eb53ff2c1df8e0f816f7186ddd309ca85e8798dd";
    //await mpt.verify(root, pproofs, keys)
    await mpt.verify(state_root, hexProof, [hexKey])

    //await mpt.verifyTrieProof(storageProofInHex, state_root, keyHash)
    //await mpt.verifyTrieProof({expectedRoot: state_root, key: hexKey, proof: hexProof, keyIndex: 0, proofIndex:0, expectedValue: state_root});
  });
});
