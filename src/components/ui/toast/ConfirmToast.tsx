import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Button from "../button";
import { Typography } from "../typography";

interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const confirmToast = ({ message, onConfirm, onCancel }: ConfirmToastProps) => {
  const ConfirmToastComponent = ({ closeToast }: { closeToast?: () => void }) => (
    <div className="text-center">
      <Typography size={14} weight="bold" className="mb-2">
        {message}
      </Typography>
      <div className="flex justify-center gap-8">
        <Button
          text="확인"
          size="xs"
          onClick={() => {
            closeToast?.();
            onConfirm();
          }}
        />
        <Button
          text="취소"
          size="xs"
          variant="stroke"
          onClick={() => {
            closeToast?.();
            onConfirm();
            if (onCancel) onCancel();
          }}
        />
      </div>
    </div>
  );

  toast(<ConfirmToastComponent />, {
    position: "top-center",
    autoClose: false,
    closeButton: false
  });
};
