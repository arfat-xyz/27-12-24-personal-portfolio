import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { ApiResponse } from "@/types/frontend-types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchData = <T>(endpoints: string) => {
  const [allData, setAllData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalDataCount, setTotalDataCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchAllData = async () => {
      try {
        const res = await axios.get<ApiResponse<T>>(endpoints);
        if (!res.data.success) {
          return frontendErrorResponse({ message: res.data?.message });
        }
        const alldata = res.data.data.result;
        setAllData(alldata);
        setTotalDataCount(res.data.data.meta.total);
        setTotalPages(res.data.data.meta.totalPage);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        return frontendErrorResponse({ message: "Something went wrong" });
      }
    };
    if (endpoints) fetchAllData();
  }, [endpoints, initialLoad]);
  return { allData, initialLoad, isLoading, totalDataCount, totalPages };
};
