import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const CLIENT_ID = "1234";

function App() {
  const [socket, setSocket] = useState();
  const [error, setError] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (socket) {
      try {
        socket.addEventListener("open", () => {
          setEvents((e) => [...e, "Connected!"]);
        });

        socket.addEventListener("close", () => {
          setEvents((e) => [...e, "Closed!"]);
        });
      } catch (error) {
        console.error(error);
        setError(JSON.stringify(error));
      }
    }
  }, [socket]);

  const handleSetSocket = (e) => {
    try {
      e.preventDefault();

      const newSocket = new WebSocket(e.target[0].value);

      setSocket(newSocket);
    } catch (error) {
      console.error(error);
      setError(JSON.stringify(error));
    }
  };

  const handleSendMessage = (e) => {
    try {
      e.preventDefault();
      const value = e.target[0].value;

      const msg = {
        type: "message",
        text: value,
        id: CLIENT_ID,
        date: Date.now(),
      };

      socket.send(JSON.stringify(msg));
      setEvents((e) => [...e, "Message: " + JSON.stringify(msg)]);
    } catch (error) {
      console.error(error);
      setError(JSON.stringify(error));
    }
  };

  return (
    <>
      <h1>Websockets 💻</h1>
      {!socket && (
        <form onSubmit={handleSetSocket}>
          <input type="text" placeholder="Introduce una URL" />
        </form>
      )}
      {socket && (
        <form onSubmit={handleSendMessage}>
          <textarea placeholder="Mensaje..." />
          <button type="submit">Enviar</button>
        </form>
      )}
      {error && (
        <pre>
          <code>{error}</code>
        </pre>
      )}
      {events.map((e) => (
        <p>{e}</p>
      ))}
    </>
  );
}

export default App;
