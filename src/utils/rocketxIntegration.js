import axios from "axios";
import {envVariables as ENVVar} from '../constants';

export const fetchFromTokenBRETT = async () => {
  try {
    if(!ENVVar.apiKey){
        console.error("Failed to fetch tokens:", "NO api key found");
        return;
    }
    const response = await axios.get("https://api.rocketx.exchange/v1/tokens?keyword=BRETT&chainId=0x2105",{
        headers:{
            "x-api-key":ENVVar.apiKey
        }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    throw error;
  }
};

export const fetchToTokenGOAT = async () => {
    try {
      if(!ENVVar.apiKey){
          console.error("Failed to fetch tokens:", "NO api key found");
          return;
      }
      const response = await axios.get("https://api.rocketx.exchange/v1/tokens?keyword=GOAT&chainId=0x11",{
          headers:{
              "x-api-key":ENVVar.apiKey
          }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      throw error;
    }
  };

export const fetchSwapQuote = async (fromToken, fromNetwork, toToken, toNetwork, amount) => {
  try {
    const response = await axios.get(`https://api.rocketx.exchange/v1/quotation?fromToken=${fromToken}&fromNetwork=${fromNetwork}&toToken=${toToken}&toNetwork=${toNetwork}&amount=${amount}&slippage=1`,
    {
        headers:{
            "x-api-key":ENVVar.apiKey
        }
    });
    return response?.data?.quotes[0];
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    throw error;
  }
};

export const executeSwap = async (fromToken, fromNetwork, toToken, toNetwork, amount) => {
  try {
    const response = await axios.post("https://api.rocketx.exchange/v1/swap", {
      fromToken,
      toToken,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error("Swap execution failed:", error);
    throw error;
  }
};
