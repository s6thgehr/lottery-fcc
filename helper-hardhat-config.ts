import { ethers } from "hardhat";

export interface networkConfigItem {
    subscriptionId?: string;
    gasLane?: string;
    keepersUpdateInterval?: string;
    raffleEntranceFee?: string;
    callbackGasLimit?: string;
    vrfCoordinatorV2?: string;
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    hardhat: {
        raffleEntranceFee: ethers.utils.parseEther("0.01").toString(),
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // Mock does not care about gasLane
        callbackGasLimit: "500000",
        keepersUpdateInterval: "30",
    },
    localhost: {
        raffleEntranceFee: ethers.utils.parseEther("0.01").toString(),
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // Mock does not care about gasLane
        callbackGasLimit: "500000",
        keepersUpdateInterval: "30",
    },
    goerli: {
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        raffleEntranceFee: ethers.utils.parseEther("0.01").toString(),
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "0", // Replace with right subId when creating subscription with UI
        callbackGasLimit: "500000",
        keepersUpdateInterval: "30",
    },
};

export const developmentChains = ["hardhat", "localhost"];
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
export const frontendContractsFile =
    "../nextjs-lottery/constants/contractAddresses.json";
export const frontendAbiFile = "../nextjs-lottery/constants/abi.json";
