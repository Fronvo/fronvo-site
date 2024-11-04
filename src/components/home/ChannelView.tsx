import ChannelBanner from "./ChannelBanner";
import ChannelChat from "./ChannelChat";
import ChannelInput from "./ChannelInput";
import ChannelMembers from "./ChannelMembers";

export default function ChannelView() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <ChannelBanner />

      <div className="flex flex-1 w-full">
        <div className="flex flex-col h-full flex-1">
          <ChannelChat />
          <ChannelInput />
        </div>

        <ChannelMembers />
      </div>
    </div>
  );
}
