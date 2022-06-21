// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Projects is Ownable {
    string[] private s_projects;

    event ProjectStored(string newProject);

    function addProject(string memory toStore) public onlyOwner {
        s_projects.push(toStore);
        emit ProjectStored(toStore);
    }

    function getProjects() public view returns (string[] memory) {
        return s_projects;
    }
}
