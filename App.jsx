import { useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { API_BASE_URL, loginRequest } from "./msalConfig";
import "./App.css";

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [employeeId, setEmployeeId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-authenticate on load
  useEffect(() => {
    if (!isAuthenticated && instance) {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log("Login failed:", e);
      });
    }
  }, [isAuthenticated, instance]);

  // Fetch user data once authenticated
  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      fetchUserData();
    }
  }, [isAuthenticated, accounts]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Get access token
      const tokenResponse = await instance.acquireTokenSilent({
        account: accounts[0],
        scopes: loginRequest.scopes,
      });

      const headers = {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      };

      // Fetch employee ID
      const empResponse = await fetch(
        `${API_BASE_URL}/api/loggedinuser`,
        { headers }
      );
      const empId = await empResponse.text();
      setEmployeeId(empId);

      // Fetch role
      const roleResponse = await fetch(
        `${API_BASE_URL}/api/LoggedInUser/${empId}`,
        { headers }
      );
      const roleData = await roleResponse.text();
      setRole(roleData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  if (!isAuthenticated) {
    return <div className="container">Authenticating...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>User Info</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="info-row">
              <span className="label">Employee ID:</span>
              <span className="value">{employeeId}</span>
            </div>
            <div className="info-row">
              <span className="label">Role:</span>
              <span className="value">{role}</span>
            </div>
          </>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
