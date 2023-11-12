//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract ETHHotPotato {
  using Counters for Counters.Counter;
  Counters.Counter public numberOfMatches;

  address public immutable owner;
  Match[] public matchList;

  struct Match {
    uint256 id;
    uint256 numberOfPlayers;
    uint256 prizePool;
    uint256 currentPosition;
    uint256 blocknumber;
    address[] players;
    bool isFinish;
  }
	
  constructor(address _owner) {
    owner = _owner;
  }

  function getMatches() public view returns (Match[] memory){
    return matchList;
  }

  function getMatcheByID(uint256 _matchId) public view returns (Match memory){
    return matchList[_matchId];
  }

  function getPlayersByMatchID(uint256 _matchId) public view returns (address[] memory) {
    return matchList[_matchId].players;
  }

  function getBlockTime() public view returns (uint256){
    return block.timestamp;
  }

  function createMatch() external {
    uint256 newMatchId = numberOfMatches.current();
    matchList.push(Match(newMatchId, 0, 0, 0, 0, new address[](0), false));
    numberOfMatches.increment();
  }

  function joinMatch(uint256 _matchId) external {
    matchList[_matchId].numberOfPlayers += 1;
    matchList[_matchId].players.push(msg.sender);
  }

  function passPotato(uint256 _matchId) external {
    if (matchList[_matchId].blocknumber == 0) {
      matchList[_matchId].blocknumber = block.timestamp + 30;
    }
    else if (matchList[_matchId].blocknumber < block.timestamp) {
      matchList[_matchId].isFinish = true;
    } else {
      matchList[_matchId].currentPosition += 1;
      if (matchList[_matchId].currentPosition >= matchList[_matchId].numberOfPlayers) {
        matchList[_matchId].currentPosition = 0;
      }
    }
  }

  // Modifier: used to define a set of rules that must be met before or after a function is executed
  // Check the withdraw() function
  modifier isOwner() {
    // msg.sender: predefined variable that represents address of the account that called the current function
    require(msg.sender == owner, "Not the Owner");
    _;
  }

  /**
   * Function that allows the owner to withdraw all the Ether in the contract
   * The function can only be called by the owner of the contract as defined by the isOwner modifier
   */
  function withdraw() public isOwner {
    (bool success, ) = owner.call{ value: address(this).balance }("");
    require(success, "Failed to send Ether");
  }

  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable {}
}