// ConfirmToast.tsx
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const confirmToast = ({ message, onConfirm, onCancel }: ConfirmToastProps) => {
  const ConfirmToastComponent = ({ closeToast }: { closeToast?: () => void }) => (
    <div className="text-center">
      <p className="mb-2">{message}</p>
      <div className="flex justify-center gap-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => {
            closeToast?.();
            onConfirm();
          }}
        >
          확인
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={() => {
            closeToast?.();
            onConfirm();
            if (onCancel) onCancel();
          }}
        >
          취소
        </button>
      </div>
    </div>
  );

  toast(<ConfirmToastComponent />, {
    position: "top-center",
    autoClose: false,
    closeButton: false
  });
};
