import React, { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

import { PiTextAa } from "react-icons/pi";
import Quill, { Delta, Op, type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "../ui/button";
import { ImageIcon, SendIcon, SmileIcon } from "lucide-react";

type EditorValue = {
	image: File | null;
	body: string;
};

import { Hint } from "./hint";
import { cn } from "@/lib/utils";

interface EditorProps {
	variant?: "create" | "update";
	onSubmit: ({ image, body }: EditorValue) => void;
	onCancel?: () => void;
	defaultValue?: Delta | Op[];
	placeholder?: string;
	disabled?: boolean;
	innerRef?: RefObject<Quill | null>;
}

function Editor({
	variant = "create",
	onSubmit,
	onCancel,
	defaultValue = [],
	placeholder = "Write something...",
	disabled,
	innerRef,
}: EditorProps) {
	const [text, settext] = useState("");
	const [isToolbarVisible, setisToolbarVisible] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const submitRef = useRef(onSubmit);
	const defaultValueRef = useRef(defaultValue);
	const placeHolderRef = useRef(placeholder);
	const quillRef = useRef<Quill | null>(null);
	const disabledRef = useRef(disabled);

	useLayoutEffect(() => {
		submitRef.current = onSubmit;
		placeHolderRef.current = placeholder;
		defaultValueRef.current = defaultValue;
		disabledRef.current = disabled;
	});

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		const container = containerRef.current;
		const editorContainer = container.appendChild(
			container.ownerDocument.createElement("div")
		);

		const options: QuillOptions = {
			theme: "snow",
			placeholder: placeHolderRef.current,
			modules: {
				toolbar: [
					["bold", "italic", "strike"],
					["link"],
					[{ list: "ordered" }, { list: "bullet" }],
				],
				keyboard: {
					bindings: {
						enter: {
							key: "Enter",
							handler: () => {
								return;
							},
						},

						shift_enter: {
							key: "Enter",
							shiftKey: true,
							handler: () => {
								quill.insertText(
									quill.getSelection()
										?.index || 0,
									"\n"
								);
							},
						},
					},
				},
			},
		};

		const quill = new Quill(editorContainer, options);

		quillRef.current = quill;
		quillRef.current.focus();

		if (innerRef) {
			innerRef.current = quill;
		}

		quill.setContents(defaultValueRef.current);

		settext(quill.getText());

		quill.on(Quill.events.TEXT_CHANGE, () => {
			settext(quill.getText());
		});

		return () => {
			quill.off(Quill.events.TEXT_CHANGE);

			if (quillRef.current) {
				quillRef.current = null;
			}

			if (innerRef?.current) {
				innerRef.current = null;
			}
			container.innerHTML = "";
		};
	}, [innerRef]);

	const isEmpty = text.replace(/<[^>]*>/g, "").trim().length === 0;

	const toogleToolbar = () => {
		setisToolbarVisible((current) => !current);
		const toolbarELement = containerRef.current?.querySelector(".ql-toolbar");

		if (toolbarELement) {
			toolbarELement.classList.toggle("hidden");
		}
	};

	return (
		<div className="flex flex-col">
			<div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition-none bg-white">
				<div ref={containerRef} className="h-full ql-custom" />
				<div className="flex px-2 pb-2 z-[5]">
					<Hint
						label={
							!isToolbarVisible
								? "Hide formatting"
								: "Show formatting"
						}
					>
						<Button
							disabled={disabled}
							size={"iconSm"}
							variant={"ghost"}
							onClick={toogleToolbar}
						>
							<PiTextAa className="size-4 " />
						</Button>
					</Hint>
					<Hint label="Emoji">
						<Button
							disabled={disabled}
							size={"iconSm"}
							variant={"ghost"}
							onClick={() => {}}
						>
							<SmileIcon className="size-4 " />
						</Button>
					</Hint>
					{variant === "create" && (
						<Hint label="Image">
							<Button
								disabled={disabled}
								size={"iconSm"}
								variant={"ghost"}
								onClick={() => {}}
							>
								<ImageIcon className="size-4 " />
							</Button>
						</Hint>
					)}
					{variant === "create" && (
						<Button
							disabled={disabled || isEmpty}
							size={"iconSm"}
							onClick={() => {}}
							className={cn(
								"ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 hover:text-white text-white"
							)}
						>
							<SendIcon className="size-4 " />
						</Button>
					)}
					{variant === "update" && (
						<div className="ml-auto flex items-center gap-x-2">
							<Button
								disabled={disabled || isEmpty}
								variant={"outline"}
								size={"sm"}
								onClick={() => {}}
								className=" bg-[#007a5a] hover:bg-[#007a5a]/80 hover:text-white text-white"
							>
								Cancel
							</Button>
							<Button
								disabled={disabled || isEmpty}
								variant={"outline"}
								size={"sm"}
								onClick={() => {}}
								className=" bg-[#007a5a] hover:bg-[#007a5a]/80 hover:text-white text-white"
							>
								Save
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="p2 text-[10px] text-muted-foreground flex justify-end">
				<p>
					<strong>Shift + Return</strong>to add a new line
				</p>
			</div>
		</div>
	);
}

export default Editor;
