import { Typography, Stack, Grid, Button } from "@mui/material";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../components/buttons/SecondaryButtonCTA";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasksTable";
import { TaskData } from "../components/tables/TasksTable";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { DomainVerification } from "@mui/icons-material";
import { ethers, BigNumber } from "ethers";
import Escrow from "../src/utils/abi/Escrow.json";
import ERC20ABI from "../src/utils/abi/ERC20Token.json";

export default function TransferCrypto() {
  const escrowABI = Escrow.abi;
  const maticTokenAddress: string =
    "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

  const withdraw = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        console.log("1");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("2");
        // RIGHT NOW WE WILL BE USING THE DEPLOYED ADDRESS, but eventually we'll pull the contract address from the backend that's associated with this task
        const escrowContractAddress =
          "0x57b355b047eda23c15a5c0eab51c9608b8684e8f";

        // Get reference to this task's escrow contract
        const escrowContract = new ethers.Contract(
          escrowContractAddress,
          escrowABI,
          signer
        );
        console.log("3");
        // Get reference to MATIC token contract
        // const maticContract = new ethers.Contract(
        //   maticTokenAddress,
        //   ERC20ABI,
        //   signer
        // );
        // console.log("4");
        // const approvalResult = await maticContract.approve(
        //   escrowContractAddress,
        //   "0"
        // );
        // await approvalResult.wait();
        console.log("5");

        const withdrawTxn = await escrowContract.withdraw();
        console.log("6");
        await withdrawTxn.wait();
        console.log("7");
      }
    } catch (error) {
      console.log(error.data);
      alert(error.data);
    }
  };

  return (
    <>
      <PageHeader title="Withdraw Crypto" />
      <Stack>
        <Typography variant="h4" color="primary" textAlign="center">
          Withdraw
        </Typography>
        <Typography
          variant="h3"
          color="primaryCTA.primary"
          display="inline"
          textAlign="center"
        >
          0.1 ETH
        </Typography>
      </Stack>
      <Grid
        container
        sx={{
          py: "5%",
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <Button onClick={withdraw}>Withdraw some Matic</Button>
        {/* <PrimaryButtonCTA
          text="Give 0.1ETH"
          size="small"
          to="/"
        />
        <SecondaryButtonCTA
          text="Withdraw crypto"
          size="small"
          to="/"
        /> */}
      </Grid>
    </>
  );
}
