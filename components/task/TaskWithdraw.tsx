import { Typography, Stack, Grid, Box, CircularProgress } from "@mui/material";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import { TaskOverviewData } from "../../src/Types";
import Escrow from "../../src/utils/abi/Escrow.json";
import { ethers } from "ethers";
import { gigTheme } from "../../src/Theme";

export default function TaskWithdrawTemplate(props: {
  data?: TaskOverviewData;
}) {
  const { data } = props;
  const escrowABI = Escrow.abi;
  const maticTokenAddress: string =
    "0x0000000000000000000000000000000000001010";
  const escrowContractAddress = data?.contractAddress;

  const withdraw = async () => {
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
        const withdrawTxn = await escrowContract.withdraw();
        await withdrawTxn.wait();
      }
    } catch (error) {
      console.log(error.data);
      alert(error.data);
    }
  };

  return (
    <>
      {data ? (
        <>
          <Stack>
            <Box m={4}>
              <Typography variant="h4" color="primary" textAlign="center">
                The task
                <Typography variant="h4" color="secondary" fontStyle="italic">
                  {data.name}
                </Typography>
                has been approved. You have earned
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
                variant="h3"
                color="primary"
                fontWeight={500}
                display="inline"
                textAlign="center"
              >
                {data.reward} ETH
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
