 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClassTokenSale is Ownable{
    address public tokenAddress;
    uint public tokenPrice;

    constructor(address _address,uint _tokenPrice){
        tokenAddress = _address;
        tokenPrice = _tokenPrice;
    }

    function buy()public payable{
        require(msg.value > 0,"must supply eth");

        uint amount = msg.value * tokenPrice;
        require(IERC20(tokenAddress).balanceOf(address(this))>= amount,"insufficient token");
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function withdrawAll( ) public onlyOwner{
        uint amount = IERC20(tokenAddress).balanceOf(address(this));
        require(address(this).balance >0 || amount >0,"noting to withdraw");
        payable(msg.sender).transfer(address(this).balance);
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }
}

