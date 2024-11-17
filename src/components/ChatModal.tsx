import { useEffect } from "react";
import { Typography } from "./ui/typography";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: "danger" | "success" | "primary";
  showCancel?: boolean;
  children?: React.ReactNode;
}

const ChatModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  confirmButtonStyle = "primary",
  showCancel = true, // 기본값 true
  children
}: ModalProps) => {
  // 버튼 스타일 매핑
  const buttonStyles = {
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
    primary: "bg-primary-500"
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[250]">
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} aria-hidden="true" />

      {/* 모달 내용 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-[16px] p-8 w-[310px] max-w-md z-10 shadow-xl flex flex-col items-center text-center"
      >
        <Typography size={18} weight={"medium"} className="mb-1">
          {title}
        </Typography>
        {/* 
        {description && <p className="text-gray-600 mb-8">{description}</p>} */}
        {description && (
          <Typography size={14} className="text-gray-500 mb-5">
            {description}
          </Typography>
        )}
        {children && <div className="mb-8 w-full">{children}</div>}

        {/* 버튼 영역 */}
        <div className="flex gap-4">
          {showCancel && (
            <button onClick={onClose} className="px-6 py-2 text-white bg-gray-800 rounded-[10px] focus:outline-none">
              <Typography size={14}>{cancelText}</Typography>
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-6 py-2 text-white rounded-[10px] focus:outline-none ${buttonStyles[confirmButtonStyle]}`}
          >
            <Typography size={14}>{confirmText}</Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
