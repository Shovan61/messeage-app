import React from "react";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const Renderer = dynamic(() => import("@/components/custom-ui-components/renderer"), {
	ssr: false,
});

interface MessageProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	isEditing: boolean;
	setIsEditing: () => void;
	isCompact: boolean;
	hideThreadButton: boolean;
	isAuthor: boolean;
}

const formatFullTime = (date: Date) => {
	return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

function Message({
	data,
	isAuthor,
	isCompact,
	isEditing,
	setIsEditing,
	hideThreadButton,
}: MessageProps) {
	console.log(data);

	const avatarFallback = data?.user?.name?.charAt(0)?.toUpperCase();

	if (isCompact) {
		return (
			<div className="flex flex-col p-1.5 gap-2 px-5 hover:bg-gray-100/60 group relative">
				<div className="flex items-start gap-2 ">
					<Hint label={formatFullTime(new Date(data._creationTime))}>
						<button className="text-xs text-muted-foreground opacity-0 leading-[22px] group-hover:opacity-100 w-[40px] text-center hover:underline">
							{format(
								new Date(data._creationTime),
								"hh:mm"
							)}
						</button>
					</Hint>
				</div>
				<Renderer value={data.body} />
			</div>
		);
	}

	return (
		<div className="flex flex-col p-1.5 gap-2 px-5 hover:bg-gray-100/60 group relative">
			<div className="flex items-start gap-2">
				<button>
					<Avatar className=" rounded-md mr-1">
						<AvatarImage
							className="rounded-md size-5"
							src={data.user.image}
						/>
						<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
				</button>
			</div>
			<Renderer value={data.body} />
		</div>
	);
}

export default Message;
