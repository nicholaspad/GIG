import { useState } from "react";
import Box from "@mui/material/Box";
import { Container, Modal, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { gigTheme } from "../../src/Theme";
import FormControl from "@mui/material/FormControl";
import DefaultGrayCard from "../../components/common/DefaultGrayCard";
import Grid from "@mui/material/Grid";
import { GenericQuestion, QuestionType, TaskProps } from "../../src/Types";
import PageHeader from "../../components/common/PageHeader";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../components/buttons/SecondaryButtonCTA";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { createTask } from "../../src/Database";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { computeUnitRewardWei } from "../../src/Helpers";
import Question from "../../components/taskerForm/Question";
import { ethers, BigNumber } from "ethers";
import EscrowFactory from "../../src/utils/abi/EscrowFactory.json";
import Escrow from "../../src/utils/abi/Escrow.json";
import ERC20ABI from "../../src/utils/abi/ERC20Token.json";
import MulticallABI from "../../src/utils/abi/Multicall.json";

export default function Form() {
  // const escrowFactoryAddress = process.env
  //   .NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS as string;
  // const maticTokenAddress = process.env
  //   .NEXT_PUBLIC_MATIC_TOKEN_ADDRESS as string;
  const escrowFactoryAddress = "0x9EE10384ba4F3f0bA59dbb8c6FE4589bC696D4B7";
  const maticTokenAddress = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
  const { isInitialized, user, Moralis } = useMoralis();
  const escrowFactoryABI = EscrowFactory.abi;
  const escrowABI = Escrow.abi;

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openPosting, setOpenPosting] = useState(false);
  const [questions, setQuestions] = useState<GenericQuestion[]>([]);
  const [currIndex, setCurrIndex] = useState(1);

  // Task overview
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cryptoAllocated, setCryptoAllocated] = useState<string>("0");
  const [maxTaskers, setMaxTaskers] = useState(0);

  // Errors associated with task overview
  const [titleError, setTitleError] = useState<boolean>();
  const [descriptionError, setDescriptionError] = useState<boolean>();
  const [cryptoAllocatedError, setCryptoAllocatedError] = useState<boolean>();
  const [maxTaskersError, setMaxTaskersError] = useState<boolean>();

  // New question from modal popup
  const [currQuestionTitle, setCurrQuestionTitle] = useState("");
  const [currQuestionChoices, setCurrQuestionChoices] = useState<string[]>([]);

  // Errors associated with new question modal popup
  const [currQuestionTitleError, setCurrQuestionTitleError] =
    useState<boolean>();
  const [currQuestionChoicesError, setCurrQuestionChoicesError] =
    useState<boolean>();

  const removeQuestion = (index: number) => {
    var array = [...questions];
    array = array.slice(0, index).concat(array.slice(index + 1, -1));
    // array.splice(index, 1)
    setQuestions(array);
    setCurrIndex(currIndex - 1);
  };

  const handleClose = () => {
    setCurrQuestionTitle("");
    setCurrQuestionChoices([]);
    setCurrQuestionTitleError(false);
    setCurrQuestionChoicesError(false);
    setOpen(false);
  };

  const handleCreateTask = async (
    newTask: TaskProps,
    cryptoAllocated: string,
    maxTaskers: number
  ) => {
    if (
      !isInitialized ||
      !confirm(
        `Are you sure you want to create task "${newTask.title}" with ${newTask.questions.length} question(s) ` +
          `and ${maxTaskers} maximum responses? You will be required to stake ${cryptoAllocated} ETH.`
      )
    )
      return;

    setOpenPosting(true);

    // Deploy new contract for this Task
    const { contractAddress, error } = await stakeCrypto();
    // const contractAddress = "0x242f379b6852aa66E7FcB0e83f8DD00D36889311";
    if (error) {
      setOpenPosting(false);
      alert(`There was an error creating this task: ${error.toString()}`);
      return;
    }
    if (!contractAddress) {
      setOpenPosting(false);
      alert("There was an error creating this task.");
      return;
    }

    // Putting Task in Moralis
    // TODO - Add contract address to database info associated with newTask
    const res = await createTask(
      Moralis,
      newTask,
      parseFloat(cryptoAllocated),
      maxTaskers,
      contractAddress
    );
    if (!res.success) {
      setOpenPosting(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    router.push("/requester/my-tasks");
  };

  const stakeCrypto = async (): Promise<{
    contractAddress: string | null;
    error: any;
  }> => {
    try {
      // @ts-expect-error
      const { ethereum } = window;
      if (ethereum && user) {
        const requesterAddress = user.get("ethAddress");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // Multicall test begin
        // let newContractABI = [
        //   "function createNewEscrow(address paymentToken, uint256 _numberOfTasks,address _requester)",
        // ];
        // let newContractIface = new ethers.utils.Interface(newContractABI);

        // const multiIface = new ethers.utils.Interface(MulticallABI);
        // let multicallAggData = multiIface.encodeFunctionData("aggregate", [
        //   [
        //     [
        //       escrowFactoryAddress,
        //       newContractIface.encodeFunctionData("createNewEscrow", [
        //         maticTokenAddress,
        //         maxTaskers,
        //         requesterAddress,
        //       ]),
        //     ],
        //     [],
        //     [],
        //   ],
        // ]);

        // New contract
        // console.log("begin multicall");
        // let newContractABI = [
        //   "function createNewEscrow(address paymentToken, uint256 _numberOfTasks,address _requester)",
        // ];
        // console.log("1");
        // let newContractIface = new ethers.utils.Interface(newContractABI);
        // console.log("2");
        // const multiIface = new ethers.utils.Interface(MulticallABI);
        // // call data
        // console.log("3");
        // const callStructData = ethers.utils.AbiCoder.prototype.encode(
        //   ["address", "bytes"],
        //   [
        //     escrowFactoryAddress,
        //     newContractIface.encodeFunctionData("createNewEscrow", [
        //       maticTokenAddress,
        //       maxTaskers,
        //       requesterAddress,
        //     ]),
        //   ]
        // );
        // console.log(callStructData);
        // console.log("3+");
        // // const callArrData = ethers.utils.AbiCoder.prototype.encode(
        // //   [],
        // //   [callStructData]
        // // );
        // let multicallAggData = multiIface.encodeFunctionData("aggregate", [
        //   callStructData,
        // ]);

        // // let newContractData = newContractIface.encodeFunctionData(
        // //   "createNewEscrow",
        // //   [maticTokenAddress, maxTaskers, requesterAddress]
        // // );

        // // console.log("newContractData", newContractData);
        // console.log("4");
        // const multicall = new ethers.Contract(
        //   "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
        //   MulticallABI,
        //   signer
        // );
        // // const callStructData = ethers.utils.AbiCoder.prototype.encode(
        // //   ["address", "bytes"],
        // //   [escrowFactoryAddress, newContractData]
        // // );
        // // // note - address target is the address that holds the function you're calling
        // // const callArrData = ethers.utils.AbiCoder.prototype.encode([
        // //   callStructData,
        // // ]);

        // console.log("5");
        // const multicallTxn = await multicall.aggregate(multicallAggData);
        // await multicallTxn.wait();
        // console.log("6");

        //
        // Deploy a new contract for this Task
        
        console.log("escrowFactory");
        const escrowFactory = new ethers.Contract(
          escrowFactoryAddress,
          escrowFactoryABI,
          signer
        );
        console.log("newContractResult");
        const newContractResult = await escrowFactory.createNewEscrow(
          maticTokenAddress,
          maxTaskers,
          requesterAddress
        );
        console.log("matic address");
        console.log(maticTokenAddress);
        await newContractResult.wait(); // Wait for transaction to be mined

        const length = await escrowFactory.escrowArrayLength();
        // @TODO: this newContractAddress is what should be pushed to MoralisDB
        const newContractAddress = await escrowFactory.escrowArray(length - 1);
        console.log("New contract address");
        console.log(newContractAddress);

        // Fund the contract with the total crypto allocated
        console.log("1");
        const escrow = new ethers.Contract(
          newContractAddress,
          escrowABI,
          signer
        );
        console.log("2");
        // Get reference to MATIC Token contract
        const maticContract = new ethers.Contract(
          maticTokenAddress,
          ERC20ABI,
          signer
        );
        console.log("3");
        var bigNumCryptoAllocated = BigNumber.from(
          parseFloat(cryptoAllocated) * 10 ** 8
        ).mul(BigNumber.from(10).pow(10));

        // Approve accessed to user's WMATIC
        console.log("4");
        const approvalTxn = await maticContract.approve(
          (escrow as unknown as any).address,
          bigNumCryptoAllocated.toString()
        );
        await approvalTxn.wait();

        // Fund the contract
        console.log("5");
        const escrowFundTxn = await escrow.fund(
          bigNumCryptoAllocated.toString()
        );

        return { contractAddress: newContractAddress, error: null };
        await escrowFundTxn.wait();
        console.log("6");
      }
      return { contractAddress: null, error: "Unknown" };
    } catch (error) {
      return { contractAddress: null, error: error };
    }
  };

  return (
    <>
      <PageHeader title="Requester Create Task" />
      <LoadingOverlay open={openPosting} text="Creating Task..." />
      <Container maxWidth="md">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            color="primary"
            variant="h4"
            fontWeight={600}
            sx={{ my: 2 }}
          >
            Create New Task
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <SecondaryButtonCTA
              text="Cancel"
              size="big"
              to="/requester/my-tasks"
            />
            <PrimaryButtonCTA
              text="Post Task"
              size="big"
              sx={{ ml: 4 }}
              onClick={() => {
                const v = (c: boolean | undefined) =>
                  c === undefined || c === true;
                const newTask: TaskProps = {
                  title: title,
                  description: description,
                  questions: questions,
                };
                const hasError =
                  v(titleError) ||
                  v(descriptionError) ||
                  v(cryptoAllocatedError) ||
                  v(maxTaskersError) ||
                  v(currQuestionTitleError) ||
                  v(currQuestionChoicesError) ||
                  newTask.questions.length < 1;

                if (hasError) {
                  alert("Please provide valid inputs!");
                  return;
                }

                handleCreateTask(newTask, cryptoAllocated, maxTaskers);
              }}
            />
          </Box>
        </Grid>

        <Typography color="secondary" align="center" fontStyle="italic" mt={3}>
          After clicking "Post Task," a series of MetaMask popups will appear.
          Please be patient as there may be delays during the task creation
          process.
        </Typography>

        {/* ===== Task Heading ===== */}
        <DefaultGrayCard>
          <FormControl fullWidth>
            <CustomTextField
              label="Task Title"
              placeholder="Ex: Consumer Research Survey"
              onChange={(e) => {
                const title = e.target.value.trim();
                setTitle(title);
                setTitleError(
                  title.length <
                    Number(process.env.NEXT_PUBLIC_MIN_TASK_DATA_CHARS)
                );
              }}
              error={titleError}
              helperText={
                titleError &&
                `Title must be longer than ${process.env.NEXT_PUBLIC_MIN_TASK_DATA_CHARS} characters`
              }
              sx={{ my: 2 }}
            />
            <CustomTextField
              label="Description"
              placeholder="Ex: Answer a survey about your opinions"
              onChange={(e) => {
                const description = e.target.value.trim();
                setDescription(description);
                setDescriptionError(
                  description.length <
                    Number(process.env.NEXT_PUBLIC_MIN_TASK_DATA_CHARS)
                );
              }}
              error={descriptionError}
              helperText={
                descriptionError &&
                `Description must be longer than ${process.env.NEXT_PUBLIC_MIN_TASK_DATA_CHARS} characters`
              }
              sx={{ mb: 2 }}
            />

            <Grid container spacing={10}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" justifyContent="left">
                  <Typography color="primary" sx={{ textAlign: "right" }}>
                    Total MATIC allocated:
                  </Typography>
                  <CustomTextField
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (isNaN(val)) {
                        return;
                      }
                      setCryptoAllocatedError(
                        isNaN(val) ||
                          val < Number(process.env.NEXT_PUBLIC_MIN_ETH)
                      );
                      setCryptoAllocated(e.target.value);
                    }}
                    error={cryptoAllocatedError}
                    helperText={
                      cryptoAllocatedError &&
                      `Must be ≥${process.env.NEXT_PUBLIC_MIN_ETH}`
                    }
                    size="small"
                    sx={{
                      ml: 2,
                      mr: 1,
                      width: 100,
                      input: { textAlign: "right" },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" justifyContent="right">
                  <Typography color="primary" sx={{ textAlign: "right" }}>
                    Max Number of Taskers:
                  </Typography>
                  <CustomTextField
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMaxTaskersError(
                        isNaN(val) ||
                          val < Number(process.env.NEXT_PUBLIC_MIN_TASKERS) ||
                          !Number.isInteger(val)
                      );
                      setMaxTaskers(val);
                    }}
                    error={maxTaskersError}
                    helperText={
                      maxTaskersError &&
                      `Must be integer ≥${process.env.NEXT_PUBLIC_MIN_TASKERS}`
                    }
                    size="small"
                    sx={{ ml: 2, width: 100 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </FormControl>
          <Typography
            color="primary"
            textAlign="center"
            mt={
              cryptoAllocatedError === false && maxTaskersError === false
                ? 2
                : 0
            }
            mx="auto"
          >
            {cryptoAllocatedError === false && maxTaskersError === false
              ? `Taskers will earn ${Moralis.Units.FromWei(
                  computeUnitRewardWei(Moralis, cryptoAllocated, maxTaskers)
                )}
          MATIC per completed task. This reward is subject to change.`
              : null}
          </Typography>
          <Typography
            color="secondary"
            align="center"
            fontStyle="italic"
            mt={2}
          >
            Your task will close when either the crypto allocation runs out or
            the number of Taskers reaches the limit, whichever comes first.
          </Typography>
        </DefaultGrayCard>
        {/* ===== End Task Heading ===== */}

        <Box display="flex" justifyContent="center">
          <PrimaryButtonCTA
            text="Add Question"
            size="small"
            onClick={() => {
              setOpen(true);
            }}
          />
        </Box>

        {/* Render all options in questions */}
        {questions.map((q: GenericQuestion, i: number) => (
          <Question q={q} key={q.idx} handleChange={() => {}} />
        ))}

        {/* ===== Modal to add another question ===== */}
        <Modal
          disableAutoFocus
          open={open}
          onClose={() => {
            handleClose();
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40%",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography color="primary" variant="h5" component="h2" mb={2}>
              Add Question
            </Typography>
            <FormControl fullWidth>
              {/* Question title field */}
              <CustomTextField
                autoFocus
                label="Question Title"
                variant="outlined"
                onChange={(e) => {
                  const title = e.target.value.trim();
                  setCurrQuestionTitle(title);
                  setCurrQuestionTitleError(
                    title.length <
                      Number(process.env.NEXT_PUBLIC_MIN_TASK_DATA_CHARS)
                  );
                }}
                error={currQuestionTitleError}
                helperText={
                  currQuestionTitleError &&
                  `Title must be longer than ${process.env.NEXT_PUBLIC_MIN_TASK_DATA_CHARS} characters!`
                }
                sx={{ mb: 2 }}
              />
              {/* Answer choices field */}
              <CustomTextField
                label="Answer Choices (comma-separated)"
                variant="outlined"
                onChange={(e) => {
                  const input = e.target.value;
                  const cleanedAnswerChoices = input
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== "");
                  setCurrQuestionChoices(cleanedAnswerChoices);
                  setCurrQuestionChoicesError(
                    cleanedAnswerChoices.length == 0 ||
                      cleanedAnswerChoices.length > 5
                  );
                }}
                placeholder="Option 1, Option 2, ..."
                error={currQuestionChoicesError}
                helperText={
                  currQuestionChoices.length == 0
                    ? "Input at least one answer choice!"
                    : currQuestionChoices.length > 5
                    ? "Too many answer choices - maximum is 5"
                    : currQuestionChoices.length > 0
                    ? `${
                        currQuestionChoices.length
                      } answer choice(s) entered: ${currQuestionChoices.join(
                        ", "
                      )}`
                    : null
                }
                sx={{ mb: 2 }}
              />
              {/* Add button */}
              <Box display="flex" justifyContent="end">
                <PrimaryButtonCTA
                  text="Add"
                  size="small"
                  onClick={() => {
                    if (
                      currQuestionTitleError ||
                      currQuestionChoicesError ||
                      currQuestionTitle == "" ||
                      currQuestionChoices.length == 0
                    ) {
                      alert("Please provide valid inputs!");
                      return;
                    }

                    const newQuestions = questions.concat([
                      {
                        id: "-1", // dummy
                        idx: questions.length,
                        type: QuestionType.SINGLE_CHOICE,
                        question: currQuestionTitle,
                        content: { options: currQuestionChoices },
                      },
                    ]);
                    setQuestions(newQuestions);
                    handleClose();
                  }}
                />
              </Box>
            </FormControl>
          </Box>
        </Modal>
        {/* ===== End Modal to add another question ===== */}
      </Container>
    </>
  );
}

const CustomTextField = styled(TextField)({
  "& .MuiInputLabel-root, .MuiOutlinedInput-root": {
    color: gigTheme.palette.primary.main,
  },
  "& .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated": {
    color: gigTheme.palette.primary.main,
  },
  "& .MuiFormHelperText-root": {
    color: gigTheme.palette.primary.main,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: gigTheme.palette.error.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: gigTheme.palette.secondary.main,
    },
    "&:hover fieldset": {
      borderColor: gigTheme.palette.secondary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: gigTheme.palette.secondary.main,
    },
    borderColor: gigTheme.palette.secondary.main,
  },
});
