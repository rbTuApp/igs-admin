const { default: axios } = require("axios");
const URL = "https://server.369fm.com.co/";
// const URL = "http://localhost:4242/";
const consumeGet = async (url, params) => {
  return await axios.get(URL + url, {
    params: params,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      'Access-Control-Allow-Origin': URL
    },
  });
};
export { URL, consumeGet };
