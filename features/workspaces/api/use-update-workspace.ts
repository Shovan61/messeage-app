import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

type RequestType = { workspaceId: Id<"workspaces">; name: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
	onSuccess?: (data: ResponseType) => void;
	onError?: (error: Error) => void;
	onSetteled?: () => void;
	throwError?: boolean;
};

export const useUpdateWorkspace = () => {
	const mutation = useMutation(api.workspaces.updateWorkspace);

	const [status, setstatus] = useState<"success" | "error" | "pending" | "setteled" | null>(
		null
	);
	
	const [data, setdata] = useState<ResponseType | null>(null);
	const [error, seterror] = useState<Error | null>(null);

	const isSuccess = useMemo(() => status === "success", [status]);
	const isError = useMemo(() => status === "error", [status]);
	const isPending = useMemo(() => status === "pending", [status]);
	const isSetteled = useMemo(() => status === "setteled", [status]);

	const mutate = useCallback(
		async (value: RequestType, options: Options) => {
			try {
				setstatus("pending");
				setdata(null);
				seterror(null);

				const response = await mutation(value);

				setstatus("success");

				setdata(response);
				options?.onSuccess?.(response);

				return response;
			} catch (error) {
				setstatus("error");
				seterror(error as Error);
				options?.onError?.(error as Error);
			} finally {
				setstatus("setteled");
				options?.onSetteled?.();
			}
		},
		[mutation]
	);

	return { mutate, data, isSetteled, isSuccess, isError, isPending, error };
};
