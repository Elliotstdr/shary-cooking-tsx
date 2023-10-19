import axios from "axios";
import { useState, useEffect } from "react";
import { store } from "../Store/store";

export const useFetchGet = (url) => {
  const [data, setData] = useState(null);
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

export const useFetchGetConditional = (url, reduxData) => {
  const [data, setData] = useState(null);
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
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    } else {
      setData(reduxData);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, loaded };
};

export const fetchGet = async (url) => {
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

export const fetchDelete = async (url) => {
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
  url,
  payload,
  noAPI = false,
  forcedToken = null
) => {
  let data = null;
  let error = null;

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

export const fetchPut = async (url, payload) => {
  let data = null;
  let error = null;

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
