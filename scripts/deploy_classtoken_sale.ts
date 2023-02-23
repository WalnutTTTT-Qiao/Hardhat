import {ethers} from "hardhat";
import {ClassToken} from "../typechain"

const formatEther = ethers.utils.formatEther

async function main() {
    // 设置一个常量initialSupply，将10000转换成10000 ETH并赋值给它。
    const initialSupply = ethers.utils.parseEther('10000.0')
    // 获取要部署的智能合约的对象，名称为ClassToken。
    const ClassToken = await ethers.getContractFactory("ClassToken")
    // 通过调用ClassToken的deploy()函数，使用初始的10000 ETH来部署智能合约，将部署后的智能合约实例赋值给token。
    const token = await ClassToken.deploy(initialSupply)
    // 等待智能合约部署完成。
    await token.deployed()
    // 打印出智能合约部署的地址。
    console.log("ClassToken deployed to:",token.address)
    // 通过调用ClassTokenSale的deploy()函数，使用token的地址和100作为参数来部署智能合约，将部署后的智能合约实例赋值给tokenSale。
    const ClassTokenSale = await ethers.getContractFactory("ClassTokenSale")
    // 等待智能合约部署完成 
    const tokenSale = await ClassTokenSale.deploy(token.address,'100')
    await tokenSale.deployed()

    console.log("ClassTokenSale deployed to:",tokenSale.address)
    // 获取所有签名者中的第一个，也就是owner。
    const [owner] = await ethers.getSigners()
    // 获取ClassToken的实例对象mytokeninstance，用于后续调用智能合约中的函数。
    const mytokeninstance:ClassToken = await ethers.getContractAt("ClassToken",token.address)
    //调用mytokeninstance的transfer()函数，将5000 ETH转移到tokenSale地址。
    await mytokeninstance.transfer(tokenSale.address,ethers.utils.parseEther('5000.0'))
    //打印出tokenSale地址中的ClassToken余额。
    console.log("ClassToken in tokenSale Contract:",formatEther(await mytokeninstance.balanceof(tokenSale.address)))
    //打印出owner地址中的ClassToken余额
    console.log("ClassToken in owner",formatEther(await mytokeninstance.balanceof(await owner.getAddress())))
}

main().catch((error) =>{
    console.error(error)
    process.exitCode = 1
})