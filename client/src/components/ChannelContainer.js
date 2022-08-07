import React, { useEffect } from "react";
import { Channel, useChatContext, MessageTeam } from "stream-chat-react";
import { ChannelInner, CreateChannel, EditChannel } from "./";
export default function ChannelContainer({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) {
  // get info about a current specific channel
  const { channel } = useChatContext();

  // when user is creating a channel
  if (isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );
  }

  // when user is editing a channel
  if (isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    );
  }

  // when there is nothing to show in the channel
  const EmptyState = () => (
    <div className="channel-empty__container">
      <p className="channel-empty__first">
        This is the beginning of your chat history.
      </p>
      <p className="channel-empty__second">
        Send messages, attachments, links, emojis, and more!
      </p>
    </div>
  );
  return (
    <div className=" channel__container">
      {/* Channel will have an component name ChannelInner */}
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
}
