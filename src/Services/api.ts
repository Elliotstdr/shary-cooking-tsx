import axios, { AxiosError, AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { store } from "../Store/store";
import { isOfType } from "./validator";

/**
 * @template { Object | Object[] } T
 * @param { string } url
 * @param { ElementType<T> } example as T or element of T
 * @return { FetchGetReturn<T> }
 */
export const useFetchGet = <T extends Object | Object[]> (
  url: string, 
  example: ElementType<T>
): UseFetchGetResponse<T> => {
  const [data, setData] = useState<T|null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const token = store.getState().auth.token;

  useEffect(() => {
    url &&
      axios
        .get(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, {
          headers: token
            ? {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              }
            : {
                accept: "application/json",
              },
        })
        .then((response: AxiosResponse) => {
          if (!isOfType<T>(response.data, example)) {
            setError("La réponse de l'API ne correspond pas au type attendu.");
            return
          }
          setData(response.data);
        })
        .catch((error: AxiosError) => setError(error.message))
        .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { data, error, loaded };
};

/**
 * @template { Object | Object[] } T
 * @param { string } url
 * @param { ElementType<T> } example as T or element of T
 * @return { FetchGetReturn<T> }
 */
export const useFetchGetConditional = <T extends Object | Object[]> (
  url: string, 
  reduxData: T | null, 
  example: ElementType<T>
): UseFetchGetResponse<T> => {
  const [data, setData] = useState<T|null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const token = store.getState().auth.token;

  useEffect(() => {
    if (!reduxData || (Array.isArray(reduxData) && reduxData.length === 0)) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, {
          headers: token
            ? {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              }
            : {
                accept: "application/json",
              },
        })
        .then((response: AxiosResponse) => {
          if (!isOfType(response.data, example)) {
            setError("La réponse de l'API ne correspond pas au type attendu.");
            return;
          }
          setData(response.data);
        })
        .catch((error: AxiosError) => setError(error.message))
        .finally(() => setLoaded(true));
    } else {
      setData(reduxData);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, loaded };
};

export const fetchDelete = async (url: string): Promise<FetchResponse> => {
  let data = null;
  let error = null;
  const token = store.getState().auth.token;
  
  await axios
    .delete(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, {
      headers: token
        ? {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            accept: "application/json",
          },
    })
    .then((response) => (data = response.data))
    .catch((e) => (error = e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error };
};

export const fetchPost = async (
  url: string,
  payload: any,
  noAPI: boolean = false,
  forcedToken: string|null = null,
  example: Object | null = null
): Promise<FetchResponse> => {
  let data: any = null;
  let error: any = null;
  const token = forcedToken ?? store.getState().auth.token;

  let fullUrl = "";
  if (noAPI) {
    fullUrl = `${process.env.REACT_APP_BASE_URL_API}${url}`;
  } else {
    fullUrl = `${process.env.REACT_APP_BASE_URL_API}/api${url}`;
  }
  await axios
    .post(fullUrl, payload, {
      headers: token
        ? {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            accept: "application/json",
          },
    })
    .then((response: AxiosResponse) => {
      if(example && !isOfType(response.data, example)) {
        error = "Votre actions a bien été effectuée mais la réponse de l'API ne correspond pas au type attendu.";
        return;
      }
      data = response.data
    })
    .catch((e: AxiosError) => (error = e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error };
};

export const fetchPut = async (
  url: string, 
  payload: any, 
  example: Object | null = null
): Promise<FetchResponse> => {
  let data = null;
  let error: any = null;
  const token = store.getState().auth.token

  await axios
    .put(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, payload, {
      headers: token
        ? {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            accept: "application/json",
          },
    })
    .then((response: AxiosResponse) => {
      if(example && !isOfType(response.data, example)) {
        error = "Votre actions a bien été effectuée mais la réponse de l'API ne correspond pas au type attendu.";
        return;
      }
      data = response.data
    })
    .catch((e: AxiosError) => (error = e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error };
};
