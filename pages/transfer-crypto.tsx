import { Typography, Stack, Grid, Button } from "@mui/material";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../components/buttons/SecondaryButtonCTA";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasksTable";
import { TaskData } from "../components/tables/TasksTable";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { DomainVerification } from "@mui/icons-material";
// import { ethers } from "ethers";

export default function TransferCrypto() {
  const { Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  async function testTransfer(val) {
    let options = {
      contractAddress: "0x356d2E7a0d592bAd95E86d19479c37cfdBb68Ab9",
      functionName: "withdraw",
      abi: [
        {
          inputs: [{ internalType: "string", name: "note", type: "string" }],
          name: "withdraw",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ]
    };

    await Moralis.authenticate();
    await Moralis.executeFunction(options);

    await contractProcessor.fetch({
      params: options,
    });
  }
  async function donation(val) {
    console.log("clicked donation button");

    let options = {
      contractAddress: "0x356d2E7a0d592bAd95E86d19479c37cfdBb68Ab9",
      functionName: "newDonation",
      abi: [
        {
          inputs: [{ internalType: "string", name: "note", type: "string" }],
          name: "newDonation",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      params: {
        note: "Thanks for your work",
      },
      msgValue: Moralis.Units.ETH(val),
    };

    await Moralis.authenticate();
    await Moralis.executeFunction(options);

    await contractProcessor.fetch({
      params: options,
    });
  }

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
        <Button onClick={() => testTransfer(0.1)}>Withdraw 0.1 Matic</Button>
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
