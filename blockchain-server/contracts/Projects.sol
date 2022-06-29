// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Projects is Ownable, ERC1155 {
    mapping(uint256 => string) private hashIpfs;

    event TokenMinted(
        address account,
        uint256 id,
        uint256 amount,
        bytes data,
        string hashIpfs
    );

    constructor() ERC1155("https://ipfs.io/ipfs/{id}") {}

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data,
        string memory p_hashIpfs
    ) public onlyOwner {
        _mint(account, id, amount, data);
        hashIpfs[id] = p_hashIpfs;
        emit TokenMinted(account, id, amount, data, p_hashIpfs);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (
            string(abi.encodePacked("https://ipfs.io/ipfs/", hashIpfs[tokenId]))
        );
    }
}
