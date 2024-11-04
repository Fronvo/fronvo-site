import { useWritable } from "react-use-svelte-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Server as ServerType } from "@/lib/types";
import { channelData, serverData } from "@/lib/stores";

interface Props {
  server: ServerType;
}

export default function Server({ server }: Props) {
  const [$serverData, setServerData] = useWritable(serverData);
  const [_, setChannelData] = useWritable(channelData);

  function selectServer() {
    setServerData(server);

    // Default to first channel
    if (server.channels.length > 0) {
      setChannelData(server.channels[0]);
    } else {
      // @ts-ignore
      setChannelData(undefined);
    }
  }

  return (
    <div className="select-none">
      <TooltipProvider>
        <Tooltip delayDuration={0} disableHoverableContent>
          <TooltipTrigger asChild>
            {server.avatar ? (
              <img
                src={server.avatar}
                draggable={false}
                className={`${
                  $serverData?.id === server.id && "bg-accent border-accent"
                } hover:bg-accent transition-[100ms] w-[50px] h-[50px] rounded-full p-1.5 mt-3 mb-3 m-auto cursor-pointer border border-1 object-cover`}
                onClick={selectServer}
              />
            ) : (
              <div
                className={`${
                  $serverData?.id === server.id && "bg-accent border-accent"
                } hover:bg-accent hover:border-accent transition-[100ms] w-[50px] h-[50px] rounded-full p-1.5 mt-3 mb-3 m-auto cursor-pointer border border-1`}
                onClick={selectServer}
              >
                <h1
                  className="translate-y-[5.5px] translate-x-[1.5px]"
                  onClick={selectServer}
                >
                  {server.name[0]}
                  {server.name[1] ? server.name[1] : ""}
                </h1>
              </div>
            )}
          </TooltipTrigger>

          <TooltipContent
            side="right"
            sideOffset={18}
            className="font-bold text-sm flex items-center"
          >
            <div className="flex flex-col">
              <h1 className="w-max">{server.name}</h1>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
