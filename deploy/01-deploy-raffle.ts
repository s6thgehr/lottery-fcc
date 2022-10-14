import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
    developmentChains,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config";
import { ethers } from "hardhat";
import verify from "../utils/verify";
import { Contract } from "ethers";

const FUND_AMOUNT = ethers.utils.parseEther("2");

const deployRaffle: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network, ethers } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    let vrfCoordinatorV2Address: string | undefined;
    let subscriptionId: string | undefined;

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        );
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse =
            await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait();
        subscriptionId = transactionReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(
            subscriptionId,
            FUND_AMOUNT
        );
    } else {
        vrfCoordinatorV2Address = networkConfig[network.name].vrfCoordinatorV2;
        subscriptionId = networkConfig[network.name].subscriptionId;
    }

    const entranceFee = networkConfig[network.name].raffleEntranceFee;
    const gasLane = networkConfig[network.name].gasLane;
    const callbackGasLimit = networkConfig[network.name].callbackGasLimit;
    const interval = networkConfig[network.name].keepersUpdateInterval;

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("----------------------------------------------------");
    const args: any[] = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ];

    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        );
        const raffleContract = await ethers.getContract("Raffle");
        vrfCoordinatorV2Mock.addConsumer(
            subscriptionId,
            raffleContract.address
        );
    }

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(raffle.address, args);
    }
    log("----------------------------------------------------");
};

export default deployRaffle;
deployRaffle.tags = ["all", "raffle"];
