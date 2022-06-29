// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Projects is Ownable, ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
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
        uint256 amount,
        bytes memory data,
        string memory p_hashIpfs
    ) public onlyOwner {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(account, newTokenId, amount, data);
        hashIpfs[newTokenId] = p_hashIpfs;
        emit TokenMinted(account, newTokenId, amount, data, p_hashIpfs);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (
            string(abi.encodePacked("https://ipfs.io/ipfs/", hashIpfs[tokenId]))
        );
    }

    function getProjectsAmount() public view returns (uint256) {
        return _tokenIds.current();
    }
}
