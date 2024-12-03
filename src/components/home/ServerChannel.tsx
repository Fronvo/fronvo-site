import { Channel } from "@/lib/types";
import { Button } from "../ui/button";
import { ChatBubbleIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useReadable, useWritable } from "react-use-svelte-store";
import {
  channelData,
  deletingChannel,
  deletingChannelData,
  editingChannel,
  editingChannelData,
  serverData,
  userData,
} from "@/lib/stores";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";

interface Props {
  channel: Channel;
}

export default function ServerChannel({ channel }: Props) {
  const $userData = useReadable(userData);
  const $serverData = useReadable(serverData);
  const [$channelData, setChannelData] = useWritable(channelData);
  const [_, setEditingChannel] = useWritable(editingChannel);
  const [__, setEditingChannelData] = useWritable(editingChannelData);
  const [___, setDeletingChannel] = useWritable(deletingChannel);
  const [____, setDeletingChannelData] = useWritable(deletingChannelData);

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={$userData.id !== $serverData.owner_id}>
        <Button
          variant={"outline"}
          className={`${
            $channelData?.id === channel.id && "bg-accent border-accent"
          } m-auto w-[90%] flex h-9 justify-start focus-none select-none`}
          tabIndex={-1}
          onClick={() => setChannelData(channel)}
        >
          <ChatBubbleIcon
            width={16}
            height={16}
            className="min-w-[16px] mr-3"
          />
          {channel.name}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setEditingChannelData(channel);
            setEditingChannel(true);
          }}
        >
          <Pencil1Icon className="mr-2" /> Edit
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => {
            setDeletingChannelData(channel);
            setDeletingChannel(true);
          }}
        >
          <TrashIcon className="mr-2" color={"red"} /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
