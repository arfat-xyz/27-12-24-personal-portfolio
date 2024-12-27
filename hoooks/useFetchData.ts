import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchData = (endpoints: string) => {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const res = await axios.get(endpoints);
        const alldata = res.data;
        setAllData(alldata);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        return frontendErrorResponse({ message: "Something went wrong" });
      }
    };
    if (endpoints) fetchAllData();
  }, [endpoints, initialLoad]);
  return { allData, initialLoad, isLoading };
};
