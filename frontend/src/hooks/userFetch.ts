import { useEffect, useState } from "react";
import { api } from "../api/axios";

interface FetchData {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown;
}

export const useFetch = (url: string) => {
  const [data, setData] = useState<FetchData[]>([]);

  useEffect(() => {
    api.get(url).then(res => setData(res.data));
  }, [url]);

  return data;
};
