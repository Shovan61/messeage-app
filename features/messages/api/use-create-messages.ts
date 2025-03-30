import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

type RequestType = {
	body: string;
	image?: Id<"_storage">;
	workspaceId: Id<"workspaces">;
	channelId?: Id<"channels">;
	parentMessageId?: Id<"messages">;
	conversationId?: Id<"conversations">
};
type ResponseType = Id<"messages"> | null;

type Options = {
	onSuccess?: (data: ResponseType) => void;
	onError?: (erro: Error) => void;
	onSetteled?: () => void;
	throwError?: boolean;
};

export const useCreateMessage = () => {
	const mutation = useMutation(api.messages.create);

	const [data, setdata] = useState<ResponseType | null>(null);
	const [error, seterror] = useState<Error | null>(null);
	const [status, setStatus] = useState<"success" | "error" | "setteled" | "pending" | null>(
		null
	);

	const isSuccess = useMemo(() => status === "success", [status]);
	const isError = useMemo(() => status === "error", [status]);
	const isSetteled = useMemo(() => status === "setteled", [status]);
	const isPending = useMemo(() => status === "pending", [status]);

	const mutate = useCallback(
		async (values: RequestType, options: Options) => {
			try {
				setdata(null);
				setStatus("pending");
				seterror(null);

				const response = await mutation(values);
				setdata(response);
				setStatus("success");
				options?.onSuccess?.(response);
				return response;
			} catch (error) {
				setStatus("error");
				seterror(error as Error);
				options?.onError?.(error as Error);
				if (options?.throwError) {
					throw error;
				}
			} finally {
				setStatus("setteled");
				options?.onSetteled?.();
			}
		},
		[mutation]
	);

	return { data, mutate, isSuccess, isError, isPending, isSetteled, error };
};
