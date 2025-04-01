import React from "react";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Thumbnail from "./thumbnail";

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


	const avatarFallback = data?.user?.name?.charAt(0)?.toUpperCase();

	if (isCompact) {
		return (
			<div className="ml-6 flex flex-col p-1.5 gap-2 px-5 hover:bg-gray-100/60 group relative">
				<div className="flex items-start gap-2 ">
					<Hint label={formatFullTime(new Date(data._creationTime))}>
						<button className="text-xs text-muted-foreground opacity-0 absolute bottom-7 leading-[22px] group-hover:opacity-100 w-[40px] text-center hover:underline">
							{format(
								new Date(data._creationTime),
								"hh:mm"
							)}
						</button>
					</Hint>
				</div>
				<Renderer value={data.body} />
				<Thumbnail url={data?.image || null}/>
			</div>
		);
	}

	return (
		<div className="flex flex-col p-1.5 gap-2 px-5 hover:bg-gray-100/60 group relative">
			<div className="flex items-start gap-2">
				<button>
					<Avatar className=" rounded-md">
						<AvatarImage
							className="rounded-md size-5"
							src={data.user.image}
						/>
						<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
				</button>
				<div className="flex flex-col w-full overflow-hidden">
					<div className="text-sm">
						<button
							className="font-bold text-primary underline"
							onClick={() => {}}
						>
							{data?.user?.name}
						</button>
						<span>&nbsp;&nbsp;</span>
						<Hint
							label={formatFullTime(
								new Date(data._creationTime)
							)}
						>
							<button className="text-xs text-muted-foreground hover:underline">
								{format(
									new Date(
										data._creationTime
									),
									"h:mm a"
								)}
							</button>
						</Hint>
					</div>
					<Renderer value={data.body} />
					<Thumbnail url={data?.image || null}/>
					{data.updatedAt ? (
						<span className="text-xs text-muted-foreground">
							(edited)
						</span>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default Message;
