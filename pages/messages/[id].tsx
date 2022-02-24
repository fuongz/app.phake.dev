import { yupResolver } from "@hookform/resolvers/yup";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useChat, sendMessage } from "../../lib/useChat";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import styles from "./../../styles/Message.module.css";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";

const MessagePage: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [pageErrors, setErrors] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        message: yup.string().required(),
      })
    ),
  });

  const { id: channelId } = router.query;
  const { channel, messages, busy } = useChat({
    channelId,
  });

  const handleSendMessage = async (data: any) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to send a message.");
      }
      const { error } = await sendMessage(data.message, channel.id, user.id);

      if (error) {
        throw error;
      }

      setErrors("");
      resetField("message");
    } catch (err: any) {
      console.error(err);
      setErrors(err.message);
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef?.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    };

    scrollToBottom();
  }, [messages]);

  return (
    <div className="mx-auto w-full rounded-md">
      <div className={styles["messages-container"]}>
        {busy && <div>Messages loading...</div>}
        {messages &&
          messages?.length > 0 &&
          messages.map((message: any) => (
            <div
              key={message.id}
              className={`mb-2 flex ${
                message.author.id === user?.id ? `justify-end` : `justify-start`
              }`}
            >
              <p
                className={`p-3 rounded-xl inline-block tracking-tight text-sm ${
                  message.author.id !== user?.id
                    ? "text-gray-100 bg-emerald-900"
                    : "text-gray-400 bg-gray-700"
                }`}
              >
                {message.message}
              </p>
            </div>
          ))}
        <div ref={messagesEndRef} style={{ height: 0 }} />
      </div>

      <div className="p-4 border border-gray-700 mb-4">
        <form onSubmit={handleSubmit(handleSendMessage)}>
          <div className="flex w-full gap-4">
            <div
              className={`input-control input-control--no-padding flex-grow ${
                errors.message ? "input-control--errors" : ""
              }`}
            >
              <input
                {...register("message")}
                id="message"
                placeholder="Message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(handleSendMessage);
                  }
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagePage;
export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/signin",
});
