import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.log(
          "Error fetching the data from http://localhost:3000/api/message"
        );
      });
  }, []);

  return (
    <>
      <h1>Production Code</h1>
      <h2 className="mt-4">Data from backend: {message}</h2>
    </>
  );
}

export default App;
