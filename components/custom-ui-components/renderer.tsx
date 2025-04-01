import Quil from "quill";
import React, { useRef, useState, useEffect } from "react";

interface RendererProps {
	value: string;
}

function Renderer({ value }: RendererProps) {
	const [isEmpty, setisEmplty] = useState(false);
	const rendereRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = rendereRef.current;

		const quill = new Quil(document.createElement("div"), {
			theme: "snow",
		});

		quill.enable(false);

		const contents = JSON.parse(value);
		quill.setContents(contents);

		const isEmpty =
			quill
				.getText()
				.replace(/<[^>]*>/g, "")
				.trim().length === 0;

		setisEmplty(isEmpty);

		container?.innerHTML = quill.root.innerHTML;

		return () => {
			if (container) {
				container.innerHTML = "";
			}
		};
	}, [value]);

	if (isEmpty) {
		return null;
	}

	return <div ref={rendereRef} className="ql-editor ql-renderer"></div>;
}

export default Renderer;
