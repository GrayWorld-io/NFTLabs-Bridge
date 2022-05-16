pragma solidity ^0.8.0;

interface INFT {
    function mintNFT(address to, string memory tokenURI) external;

    function burn(address owner, uint256 tokenId) external;
}
