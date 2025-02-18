import { useEffect, useState } from "react";

export const WS_URL = "ws://localhost:8080";

export function useSocket(token : string) {
  const [socket, setSocket] = useState<WebSocket>();
  const [loading, setLoading] = useState(false);

  console.log("socket is called again")

  useEffect(() => {
    console.log(socket)
    if (!socket) {
      const ws = new WebSocket(`${WS_URL}/?token=${token}`);
      setLoading(true);
      console.log("socket called");
      ws.onopen = () => {
        setSocket(ws);
        setLoading(false);
      };
      ws.onerror = () => {
        // could be the logic is wrong
        setSocket(ws);
      };
    }
  }, [socket]);

  return {
    socket,
    loading,
  };
}
