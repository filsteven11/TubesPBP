import { useEffect, useState } from "react";
import { api } from "../api/api";

interface Product {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown;
}

export const useFetch = (url: string) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(url);
        setData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
