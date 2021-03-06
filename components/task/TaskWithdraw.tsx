import { Typography, Stack, Grid, Box, CircularProgress } from "@mui/material";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import { TaskOverviewData } from "../../src/Types";
import Escrow from "../../src/utils/abi/Escrow.json";
import { ethers } from "ethers";
import { gigTheme } from "../../src/Theme";
import { useRouter } from "next/router";
import { withdrawTaskerTask } from "../../src/Database";
import { useMoralis } from "react-moralis";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { useState } from "react";

export default function TaskWithdrawTemplate(props: {
  data?: TaskOverviewData;
}) {
  const [openWithdrawing, setOpenWithdrawing] = useState(false);
  const { data } = props;
  const router = useRouter();
  const { Moralis } = useMoralis();
  const escrowABI = Escrow.abi;
  const maticTokenAddress: string =
    "0x0000000000000000000000000000000000001010";
  const escrowContractAddress = data?.contractAddress;

  const withdraw = async () => {
    if (!data) return;
    const escrowContractAddress = data.contractAddress;

    try {
      // @ts-expect-error
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // Get reference to this task's escrow contract
        const escrowContract = new ethers.Contract(
          escrowContractAddress as string,
          escrowABI,
          signer
        );

        // Get reference to MATIC token contract
        // const maticContract = new ethers.Contract(
        //   maticTokenAddress,
        //   ERC20ABI,
        //   signer
        // );
        // const approvalResult = await maticContract.approve(
        //   escrowContractAddress,
        //   "0"
        // );
        // await approvalResult.wait();

        setOpenWithdrawing(true);
        const withdrawTxn = await escrowContract.withdraw();
        await withdrawTxn.wait();
        alert(`Successfully withdrew ${data?.reward} MATIC`);

        // change task status to completed - 4
        const res = await withdrawTaskerTask(Moralis, data?.task_id as string);
        if (!res.success) {
          alert(res.message);
          return;
        }
        alert(res.message);
      }
    } catch (error: any) {
      console.log(error.data);
      alert(`Error: ${error.data}`);
    }
    // after withdrawing go back to my-tasks
    setOpenWithdrawing(false);
    router.back();
  };

  return (
    <>
      {data ? (
        <>
          <LoadingOverlay
            open={openWithdrawing}
            text="Withdrawing Task Funds..."
          />
          <Stack>
            <Box m={4}>
              <Typography variant="h6" color="primary" textAlign="center">
                Your submission for
                <Typography
                  my={2}
                  component="div"
                  variant="h4"
                  color="secondary"
                  fontStyle="italic"
                >
                  {data.name}
                </Typography>
                has been approved! You have earned
              </Typography>
            </Box>

            <Box
              borderRadius={2}
              width="fit-content"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              mt={1}
              mb={3}
              mx="auto"
              py={1}
              px={2}
              sx={{
                backgroundImage: `linear-gradient(90deg, ${gigTheme.palette.primaryCTA.primary}, ${gigTheme.palette.primaryCTA.secondary})`,
              }}
            >
              <Typography
                variant="h4"
                color="primary"
                fontWeight={500}
                display="inline"
                textAlign="center"
              >
                {data.reward} MATIC
              </Typography>
            </Box>
          </Stack>
          <Grid
            container
            sx={{
              py: "3%",
              display: "flex",
              justifyContent: "space-evenly",
              flexDirection: "row",
            }}
          >
            <PrimaryButtonCTA text="Withdraw" size="big" onClick={withdraw} />
          </Grid>
        </>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="secondary" sx={{ mt: 2, mb: 3 }} />
          <Typography
            textAlign="center"
            color="primary"
            fontWeight={400}
            fontSize={20}
          >
            Loading...
          </Typography>
        </Box>
      )}
    </>
  );
}
