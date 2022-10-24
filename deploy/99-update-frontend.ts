import fs from "fs";
import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const {
    frontendContractsFile,
    frontendAbiFile,
} = require("../helper-hardhat-config");

const updateUI: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { network, ethers } = hre;
    if (process.env.UPDATE_FRONTEND) {
        console.log("Writing to frontend...");
        await updateContractAddresses();
        await updateAbi();
        console.log("Frontend written.");
    }
};

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle");
    fs.writeFileSync(
        frontendAbiFile,
        raffle.interface.format(ethers.utils.FormatTypes.json).toString()
    );
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle");
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontendContractsFile, "utf8")
    );
    const chainId = network.config.chainId;
    if (chainId == undefined) {
        return;
    } else if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId].push(raffle.address);
        }
    } else {
        contractAddresses[chainId] = [raffle.address];
    }
    fs.writeFileSync(frontendContractsFile, JSON.stringify(contractAddresses));
}

export default updateUI;
updateUI.tags = ["all", "frontend"];
