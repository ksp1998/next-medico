import { useEffect, useState } from "react";
import { NoticeProps } from "./props";

export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};

export const useFetchData = (
    endpoint: string,
    params: Record<string, any>,
    key: string = ""
) => {
    const [response, setResponse] = useState<Record<string, any>>({});
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    key = key || endpoint.replace(/\/?api\//, "");

    useEffect(() => {
        if (!endpoint) {
            setError("URL required!");
            return;
        }

        const abortController = new AbortController();
        let ignore = false;
        setLoading(true);
        setError("");

        const searchParams = new URLSearchParams(params);
        fetch(`${endpoint}?${searchParams}`, { signal: abortController.signal })
            .then((response) => {
                if (!response.ok) {
                    throw Error("Could not fetch the data!");
                }
                return response.json();
            })
            .then((json) => {
                if (!ignore) {
                    setResponse(json);
                    if (json[key]) {
                        setData(json[key] ?? []);
                        setCount(json?.count);
                    } else {
                        throw Error(json.error);
                    }
                    setLoading(false);
                }
            })
            .catch((error) => !ignore && setError(error.toString()))
            .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
            abortController.abort();
        }
    }, [endpoint, params, key]);

    const notice: NoticeProps = {
        message: error,
        severity: "error",
    };
    return {
        data,
        count,
        loading,
        error: notice,
        response,
    };
};
