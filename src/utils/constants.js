const { default: axios } = require("axios");
const URL = "https://www.server.369fm.com.co/";
// const URL = "http://localhost:4242/";
const consumeGet = async (url, params) => {
  return await axios.get(URL + url, {
    params: params,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  });
};
export { URL, consumeGet };
