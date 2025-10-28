// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SimpleGreeting
 * @notice Mini contrat pour démo (set/get d'un message)
 */
contract SimpleGreeting {
    string private greeting;

    event GreetingChanged(address indexed sender, string newGreeting);

    constructor(string memory initialGreeting) {
        greeting = initialGreeting;
        emit GreetingChanged(msg.sender, initialGreeting);
    }

    function setGreeting(string calldata newGreeting) external {
        greeting = newGreeting;
        emit GreetingChanged(msg.sender, newGreeting);
    }

    function getGreeting() external view returns (string memory) {
        return greeting;
    }
}
