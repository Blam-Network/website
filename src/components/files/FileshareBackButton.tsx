"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { isBlamNetworkReferrer } from "@/src/utils/isBlamNetworkReferrer";

export function FileshareBackButton() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isBlamNetworkReferrer(document.referrer, window.location.origin));
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Button
      onClick={() => router.back()}
      startIcon={<ArrowBackIcon />}
      sx={{ alignSelf: "flex-start", textTransform: "none" }}
    >
      Back
    </Button>
  );
}
