import { Box, Typography } from "@mui/material";

export default function TaskerPageHeader(props: {
  title: string;
  subtitle: string;
}) {
  return (
    <Box textAlign="center" my={3} p={2}>
      <Typography color="primary.main" fontWeight={600} fontSize={40}>
        {props.title}
      </Typography>
      <Typography
        color="secondary.main"
        fontStyle="italic"
        fontWeight={400}
        fontSize={20}
        mt={1}
      >
        {props.subtitle}
      </Typography>
    </Box>
  );
}
