import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

type RequestType = { name: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
	onSuccess?: (data: ResponseType) => void;
	onError?: (error: Error) => void;
	onSetteled?: () => void;
	throwError?: boolean;
};

export const useCreateWorkspace = () => {
	const [status, setstatus] = useState<"success" | "error" | "setteled" | "pending" | null>(
		null
	);
	const [data, setdata] = useState<ResponseType>(null);
	const [error, seterror] = useState<Error | null>(null);

	const mutation = useMutation(api.workspaces.createWorkspace);

	const isPending = useMemo(() => status === "pending", [status]);
	const isError = useMemo(() => status === "error", [status]);
	const isSetteled = useMemo(() => status === "setteled", [status]);
	const isSuccess = useMemo(() => status === "success", [status]);

	const mutate = useCallback(
		async (values: RequestType, options?: Options) => {
			try {
				setdata(null);
				seterror(null);
				setstatus("pending");
				const response = await mutation(values);
				options?.onSuccess?.(response);
				setdata(response);
				setstatus("success");
				return response;
			} catch (error) {
				options?.onError?.(error as Error);
				setstatus("error");
				seterror(error as Error);
				if (options?.throwError) {
					throw error;
				}
			} finally {
				setstatus("setteled");
				options?.onSetteled?.();
			}
		},
		[mutation]
	);

	return {
		mutate,
		data,
		error,
		isSuccess,
		isPending,
		isError,
		isSetteled,
	};
};
