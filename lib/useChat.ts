import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export const useChat = (props: any) => {
  const [newMessage, handleNewMessage] = useState<any | null>(null);
  const [deletedMessage, handleDeletedMessage] = useState<any | null>(null);
  const [changedUser, handleChangedUser] = useState<any | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

  //
  const [channel, setChannel] = useState<any | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    if (props?.channelId) {
      const handleGetChannel = async () => {
        setBusy(true);
        await getChannel(
          {
            channelId: props.channelId,
            userId: supabase.auth.user()?.id,
          },
          (res: any) => {
            setChannel(res.channel);
            setMessages(res.messages);
          }
        );

        setBusy(false);
      };

      handleGetChannel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelId]);

  // Listen for new messages
  useEffect(() => {
    if (channel) {
      console.log("--- Listening on", channel.id);
      const messageListener = supabase
        .from(`messages:channel_id=eq.${channel.id}`)
        .on("INSERT", (payload) => handleNewMessage(payload.new))
        .on("DELETE", (payload) => handleDeletedMessage(payload.old))
        .subscribe();

      return () => {
        messageListener.unsubscribe();
      };
    }
  }, [channel]);

  useEffect(() => {
    if (newMessage) {
      const handleAddMessage = async () => {
        const author = await fetchUser(newMessage.user_id);
        if (!author.error) {
          setMessages(messages.concat({ ...newMessage, author: author.data }));
        }
      };
      handleAddMessage();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]);

  return {
    messages,
    channel,
    users,
    busy,
  };
};

export const getChannel = async ({ channelId, userId }: any, callback: any) => {
  try {
    const { body } = await supabase
      .from("channels")
      .select(`*`)
      .eq("slug", channelId)
      .contains("members", [userId])
      .single();

    if (callback)
      callback({
        channel: body,
        messages: await getMessages(body?.id).then((res) => res.data),
      });
  } catch (err: any) {
    console.log(err);
    return {
      channel: null,
      messages: [],
      error: err,
    };
  }
};

export const getMessages = async (channelId: string) => {
  try {
    const { body } = await supabase
      .from("messages")
      .select(`*, author:user_id(*)`)
      .eq("channel_id", channelId)
      .order("inserted_at", { ascending: false })
      .limit(25);
    return {
      data: body?.reverse(),
      error: null,
    };
  } catch (err: any) {
    console.log(err);
    return {
      data: [],
      error: err,
    };
  }
};

export const sendMessage = async (
  message: string,
  channelId: number,
  userId: string
) => {
  try {
    const { body } = await supabase.from("messages").insert({
      message,
      channel_id: channelId,
      user_id: userId,
    });
    return {
      error: null,
      data: body,
    };
  } catch (err: any) {
    return { error: err, data: null };
  }
};

export const fetchUser = async (userId: string, _callback: any = null) => {
  try {
    const { body } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (_callback) _callback(body);

    return {
      error: null,
      data: body,
    };
  } catch (err: any) {
    return { error: err, data: null };
  }
};
