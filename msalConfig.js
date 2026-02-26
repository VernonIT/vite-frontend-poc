// ===== CONFIGURATION =====
// Update these with your Entra ID app registration values
const CLIENT_ID = "YOUR_CLIENT_ID_HERE";
const TENANT_ID = "YOUR_TENANT_ID_HERE";
const API_BASE_URL = "YOUR_API_BASE_URL_HERE";

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["api://" + CLIENT_ID + "/access_as_user"],
};

export { CLIENT_ID, API_BASE_URL };
