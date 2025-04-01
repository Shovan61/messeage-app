import { GetMessageReturnType } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import React from "react";
import Message from "./message";

interface MessageListProps {
	channelName?: string;
	memberImage?: string;
	memberName?: string;
	channelCreationTime?: string;
	variant?: "channel" | "thread" | "converstaion";
	data: GetMessageReturnType | undefined;
	loadMore: () => void;
	isLoadingMore: boolean;
	canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
	const date = new Date(dateStr);
	if (isToday(date)) {
		return "Today";
	}
	if (isYesterday(date)) {
		return "Yesterday";
	}

	return format(date, "EEEE MMMM d");
};

const TIME_THRESHOLD = 5;

function MessageList({
	channelCreationTime,
	channelName,
	memberImage,
	memberName,
	variant,
	canLoadMore,
	loadMore,
	isLoadingMore,
	data,
}: MessageListProps) {
	const groupMessages = data?.reduce(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(groups: any, message: any) => {
			if (message?._creationTime) {
				const date = new Date(message?._creationTime);
				const dateKey = format(date, "yyyy-MM-dd");

				if (!groups[dateKey]) {
					groups[dateKey] = [];
				}

				groups[dateKey].unshift(message);
				return groups;
			}
		},
		{} as Record<string, typeof data>
	);

	return (
		<div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scroll">
			{Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
				<div key={dateKey}>
					<div className="text-center my-2 relative">
						<hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
						<span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
							{formatDateLabel(dateKey)}
						</span>
					</div>

					{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
					{messages?.map((message: any, index: number) => {
						const previousMessage = messages[index - 1];
						const isCompact =
							previousMessage &&
							previousMessage?.user?._id ===
								message?.user?._id &&
							differenceInMinutes(
								new Date(message?._creationTime),
								new Date(
									previousMessage?._creationTime
								)
							) < TIME_THRESHOLD;

						return (
							<div key={index}>
								<Message
									data={message}
									isEditing={false}
									setIsEditing={() => {}}
									isCompact={isCompact}
									hideThreadButton={false}
									isAuthor={false}
								/>
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

export default MessageList;
