import storage from "../../utils/storage";
import client, { addTokenToHeaders } from "../../api/client";

const loginBaseUrl = "/api/auth";

export function login(credentials) {
  const url = `${loginBaseUrl}/login`;
  return client
    .post(url, credentials)
    .then(({ accessToken }) => {
      addTokenToHeaders(accessToken);
      storage.set("AUTH_TOKEN", accessToken);
    })
    .catch((error) => {
      throw error;
    });
}

export const logout = () => {
  return new Promise(function (resolve) {
    storage.remove("AUTH_TOKEN");
    resolve();
  });
};
