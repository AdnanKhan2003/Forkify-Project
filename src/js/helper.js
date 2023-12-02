import "core-js/stable";
import "regenerator-runtime";
import { API_URL, TIMEOUT_SEC } from "./config";

export const timeout = async function (sec) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${sec} seconds`));
    }, sec * 1000);
  });
};

export const AJAX = async function (url, sendData = undefined) {
  try {
    const fetchPro = sendData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
