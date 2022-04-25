import { Typography, Stack, Grid, Button, Box } from "@mui/material";
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
import { useState } from "react";
import { TaskOverviewData } from "../../src/Types";

export default function TransferCrypto( props: {
  data: TaskOverviewData;
}
) {
  const escrowABI = Escrow.abi;
  const maticTokenAddress: string =
    "0x0000000000000000000000000000000000001010";
  // RIGHT NOW WE WILL BE USING THE DEPLOYED ADDRESS, but eventually 
  // we'll pull the contract address from the backend that's associated with this task
  const escrowContractAddress =
        "0x242f379b6852aa66E7FcB0e83f8DD00D36889311";

  const [contract, setContract] = useState<ethers.Contract>();

  const withdraw = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        console.log("1");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("2");
        
        // Get reference to this task's escrow contract
        const escrowContract = new ethers.Contract(
          escrowContractAddress,
          escrowABI,
          signer
        );

        setContract(escrowContract)
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
        <Box
          m={3}
        >
          <Typography variant="h4" color="primary" textAlign="center">
            [Task name] has been approved. You have earned
          </Typography>
        </Box>
          <Typography
            variant="h3"
            color="primaryCTA.primary"
            display="inline"
            textAlign="center"
          >
            [Insert Amount] ETH
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
        {/* <Button onClick={withdraw}>Withdraw Matic</Button> */}
        <PrimaryButtonCTA
          text="Withdraw"
          size="big"
          // to="/"
          onClick={withdraw}
        />
      </Grid>
    </>
  );
}
