// SPDX-License-Identifier: MIT

pragma solidity ^0.8;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdsale is Ownable {
  using SafeMath for uint256;

  // The token being sold
   IERC20 public immutable token;

  // Address where funds are collected
  address payable public wallet;

  // How many token units a buyer gets per BNB
  uint256 rate = 3000;

  // Amount of wei raised
  uint256 public weiRaised;

  constructor(address _token) {
    wallet = payable(msg.sender);
    token = IERC20(_token);
  }
   receive () external payable {
       buyTokens();
  }

  function buyTokens() public payable {
    require(msg.value >= 0.01 ether, "cant buy less with than 0.01 bnb");
    require(2 ether >= msg.value, "cannot buy with more than 2 BNB");
   uint256 weiAmount = msg.value;
   uint256 tokens = weiAmount * rate;
   require(token.balanceOf(address(this)) >= tokens, "Insufficient tokens in contract");
    weiRaised += weiAmount;
   
   
   token.transfer(msg.sender, tokens);
    
    (bool callSuccess, ) = payable(wallet).call{value: msg.value}("");
        require(callSuccess, "Call failed");
    
  }

  function deposit (uint amount) external onlyOwner {
        require(amount > 0, "Depost value must be greater than 0");
       token.transferFrom(msg.sender, address(this), amount * 1 * 10 ** 18);        

    }

  function withdraw (uint amount) external onlyOwner {
        require(token.balanceOf(address(this)) > 0, "There is not enough token in contract");
        token.transfer(msg.sender, amount * 1 * 10 ** 18);        
    }
    
    function checkbalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function changeRate(uint256 _rate) external onlyOwner {
        rate = _rate;
    }

    function changeWallet(address payable _wallet) external onlyOwner {
        wallet = _wallet;
    }

    function getRate() public view returns(uint256) {
        return rate;
    }

}
