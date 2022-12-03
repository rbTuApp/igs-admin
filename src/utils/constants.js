const { default: axios } = require("axios");
const URL = process.env.REACT_APP_SERVER_DOMAIN;
const consumeGet = async (url, params) => {
  return await axios.get(URL + url, {
    params: params,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  });
};
export { URL, consumeGet };
