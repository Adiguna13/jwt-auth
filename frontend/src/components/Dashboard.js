import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
// import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false); // Track whether to show the table
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response && error.response.status === 401) {
        setError("Authentication failed. Please log in."); // Set custom error message
      } else {
        setError("An error occurred while fetching users."); // Set a generic error message
      }
    }
  };

  const handleShowTable = () => {
    // setShowTable(true);
    setShowTable((prevShowTable) => !prevShowTable);
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1>
          <b>Welcome Back: {name} </b>
        </h1>
        {/* <button className="button is-info" onClick={getUsers}>
          Get Users
        </button> */}
        <button className="button is-info" onClick={handleShowTable}>
          Show Users
        </button>
        {showTable && ( // Render the table only when showTable is true
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
