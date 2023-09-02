import axios from "axios";

export const getSolarOutput = async () => {
  const result = await axios.get("http://192.168.178.143/js/status.js");
  const text = result.data;

  //console.log("text from inverter:", text);

  const regex = /webData="([^"]+)"/;
  const matches = text.match(regex);
  const values = matches[1].split(",");
  return {
    peak: values[4],
    current: values[5],
  };
};
