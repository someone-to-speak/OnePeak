import { SubmitHandler, useForm } from "react-hook-form";
import Icon from "@/components/ui/icon";
import { UseMutateFunction } from "@tanstack/react-query";
import { MessageWithUserInfo } from "@/types/chatType/chatType";

interface InputFieldProps {
  sendMessage: UseMutateFunction<
    void,
    Error,
    {
      content: string;
    },
    {
      previousMessages: MessageWithUserInfo[] | undefined;
    }
  >;
  sendMessageToChannel: ({ content }: { content: string }) => void;
}

type FormValues = {
  input: string;
};

const InputField: React.FC<InputFieldProps> = ({ sendMessage, sendMessageToChannel }) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    sendMessage({ content: data.input as string });
    sendMessageToChannel({ content: data.input as string });
    reset({ input: "" });
  };

  return (
    <form
      className="absolute bottom-0 pb-safe-offset-0 w-full px-4 py-[10px] bg-gray-900"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-[10px] py-2 pr-2 h-[40px] bg-white items-center rounded-[50px]">
        <input className="w-full px-[20px] " {...register("input")} />
        <button type="submit" className="bg-secondary-900 rounded-full">
          <Icon name={"arrowup"} size={26} color={"#FFB733"} />
        </button>
      </div>
    </form>
  );
};

export default InputField;
