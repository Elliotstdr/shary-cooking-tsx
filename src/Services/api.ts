import axios, { AxiosError, AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { store } from "../Store/store";

function isOfType<T>(obj: any, expectedKeys: (keyof T)[]): obj is T {
  return expectedKeys.every(key => key in obj);
}

export const useFetchGet = (url: string) => {
  const [data, setData] = useState<any|null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const reduxStore = store.getState();
  const token = reduxStore.auth.token;

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
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { data, error, loaded };
};

export const useFetchGetConditional = <T> (url: string, reduxData: any, example: any) => {
  const [data, setData] = useState<T|null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const reduxStore = store.getState();
  const token = reduxStore.auth.token;

  useEffect(() => {
    if (!reduxData || reduxData.length === 0) {
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
        .then((response: AxiosResponse<T>) => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            const expectedKeys = Object.keys(example) as (keyof T)[];
            if (!isOfType<T>(response.data[0], expectedKeys)) {
              setError("La réponse de l'API ne correspond pas au type attendu.");
              return;
            }
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

export const fetchGet = async (url: string) => {
  let data = null;
  let error = null;

  const reduxStore = store.getState();
  const token = reduxStore.auth.token;
  await axios
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
    .then((response) => (data = response.data))
    .catch((e) => (error = e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error };
};

export const fetchDelete = async (url: string) => {
  let data = null;
  let error = null;

  const reduxStore = store.getState();
  const token = reduxStore.auth.token;
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
  forcedToken: string|null = null
) => {
  let data: any = null;
  let error: any = null;

  const reduxStore = store.getState();
  const token = forcedToken ?? reduxStore.auth.token;

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
    .then((response) => (data = response.data))
    .catch((e) => (error = e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error };
};

export const fetchPut = async (url: string, payload: any) => {
  let data = null;
  let error: any = null;

  const reduxStore = store.getState();
  const token = reduxStore.auth.token;
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
    .then((response) => (data = response.data))
    .catch((e) => (error = e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error };
};
