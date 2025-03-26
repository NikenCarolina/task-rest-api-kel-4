import axios from "axios";

const API_URL = "https://apidevportal.aspi-indonesia.or.id:44310";

const getBalanceInquiry = async () => {
  try {
    let headers = {
      "Content-Type": import.meta.env.VITE_CONTENT_TYPE,
      HttpMethod: import.meta.env.VITE_HTTP_METHOD,
      EndpoinUrl: import.meta.env.VITE_ENDPOIN_URL,
      "X-TIMESTAMP": import.meta.env.VITE_X_TIMESTAMP,
      "X-CLIENT-KEY": import.meta.env.VITE_X_CLIENT_KEY,
      Private_Key: import.meta.env.VITE_PRIVATE_KEY,
      "X-CLIENT-SECRET": import.meta.env.VITE_X_CLIENT_SECRET,
      "X-PARTNER-ID": import.meta.env.VITE_X_PARTNER_ID,
      "X-EXTERNAL-ID": import.meta.env.VITE_X_EXTERNAL_ID,
      "CHANNEL-ID": import.meta.env.VITE_CHANNEL_ID,
    };

    const API = axios.create({ baseURL: API_URL, headers });

    // Step 1: Get Signature Auth
    const signatureAuthResponse = await API.post(
      "/api/v1.0/utilities/signature-auth"
    );
    if (!signatureAuthResponse.data.signature)
      throw new Error("Signature not found");
    headers["X-SIGNATURE"] = signatureAuthResponse.data.signature;

    // Step 2: Get Access Token
    const tokenResponse = await API.post(
      "/api/v1.0/access-token/b2b",
      {
        grantType: "client_credentials",
        additionalInfo: {},
      },
      { headers }
    );
    if (!tokenResponse.data.accessToken)
      throw new Error("Access token not found");
    headers.Authorization = `Bearer ${tokenResponse.data.accessToken}`;
    headers.AccessToken = tokenResponse.data.accessToken;

    // Step 3: Get Signature Service
    const signatureServiceResponse = await API.post(
      "/api/v1.0/utilities/signature-service",
      {
        partnerReferenceNo: "2020102900000000000001",
        bankCardToken: "6d7963617264746f6b656e",
        accountNo: "2000100101",
        balanceTypes: ["Cash", "Coins"],
        additionalInfo: { deviceId: "12345679237", channel: "mobilephone" },
      },
      { headers }
    );
    if (!signatureServiceResponse.data.signature)
      throw new Error("Signature not found");
    headers["X-SIGNATURE"] = signatureServiceResponse.data.signature;

    // Step 4: Perform Balance Inquiry
    const balanceInquiryResponse = await API.post(
      "/api/v1.0/balance-inquiry",
      {
        partnerReferenceNo: "2020102900000000000001",
        bankCardToken: "6d7963617264746f6b656e",
        accountNo: "2000100101",
        balanceTypes: ["Cash", "Coins"],
        additionalInfo: { deviceId: "12345679237", channel: "mobilephone" },
      },
      { headers }
    );

    return balanceInquiryResponse.data;
  } catch (error) {
    console.error("Error performing balance inquiry:", error);
    throw error;
  }
};

export default getBalanceInquiry;
