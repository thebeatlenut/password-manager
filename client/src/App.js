import "./App.css";
import { useState, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import Axios from "axios";
function App() {
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/showPasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    Axios.post("http://localhost:3001/addPassword", {
      password: password,
      website: website,
      username: username,
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptPassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      navigator.clipboard.writeText(response.data);
    });
  };

  return (
    <div className="App">
      <div className="AddingPassword">
        <input
          type="text"
          placeholder="Website"
          onChange={(event) => {
            setWebsite(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />

        <button onClick={addPassword}>Add Password</button>
      </div>
      <div className="Passwords">
        {passwordList.map((val, key) => {
          return (
            <div
              className="password"
              onClick={() => {
                decryptPassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
              key={key}
            >
              <h3>{val.website}</h3>
              <div className="username">
                <h5>{val.username}</h5>
                <h5>
                  <FaRegCopy />
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
