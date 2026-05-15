import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import useWebRTC from "./hooks/useWebRTC";

import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [timer, setTimer] = useState(60);
  const [users, setUsers] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disconnected, setDisconnected] = useState(false);

  const {
    joinVoice,
    leaveVoice,
    toggleMute,
    inVoice,
    muted,
    speaking,
    peers
  } = useWebRTC(users);

  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const handleConnect = () => {
      setSocketId(socket.id);
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);
  useEffect(() => {
    socket.on("disconnect", () => {
      setDisconnected(true);
    });

    socket.on("connect", () => {
      setDisconnected(false);
    });

    return () => {
      socket.off("disconnect");
      socket.off("connect");
    };
  }, []);
  useEffect(() => {
    socket.on("connect", () => {
      setLoading(false);
    });

    return () => {
      socket.off("connect");
    };
  }, []);
  useEffect(() => {
    const handleError = (msg) => {
      alert(msg);
    };

    socket.on("errorMsg", handleError);

    return () => {
      socket.off("errorMsg", handleError);
    };
  }, []);
  const sendEmoji = (emoji) => {
    socket.emit("sendEmoji", emoji);
  };

  useEffect(() => {
    const handleRoomData = (roomData) => {
      setRoom(roomData);
      setUsers(roomData.users || []);
    };

    const handleMessage = (msg) => {
      setChat((prev) => [...prev, msg]);
    };

    const handleTimer = (t) => setTimer(t);

    const handleUsers = (u) => setUsers(u);

    const handleEnd = () => {
      alert("⏳ Room ended!");
      window.location.reload();
    };
    const handleEmoji = (emoji) => {
      const newEmojis = [];

      for (let i = 0; i < 6; i++) {
        const id = Date.now() + Math.random();

        newEmojis.push({
          id,
          emoji,
          x: Math.random() * 100,
          scale: 0.8 + Math.random() * 1.5,
          rotate: Math.random() * 360,
          duration: 1500 + Math.random() * 1000
        });

        setTimeout(() => {
          setEmojis((prev) => prev.filter((e) => e.id !== id));
        }, 2500);
      }

      setEmojis((prev) => [...prev, ...newEmojis]);
    };

    // ---- WebRTC ----
    const handleOffer = async ({ offer, from }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      await pc.setRemoteDescription(offer);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { answer, to: from });

      pc.ontrack = (e) => {
        const audio = document.createElement("audio");
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
      };

      peers.current[from] = pc;
    };

    const handleAnswer = async ({ answer, from }) => {
      const pc = peers.current[from];
      if (pc) await pc.setRemoteDescription(answer);
    };

    const handleIce = ({ candidate, from }) => {
      const pc = peers.current[from];
      if (pc) pc.addIceCandidate(candidate);
    };

    // ---- socket bindings ----
    socket.on("roomData", handleRoomData);
    socket.on("receiveMessage", handleMessage);
    socket.on("timer", handleTimer);
    socket.on("updateUsers", handleUsers);
    socket.on("roomEnded", handleEnd);

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);
    socket.on("receiveEmoji", handleEmoji);

    return () => {
      socket.off("roomData", handleRoomData);
      socket.off("receiveMessage", handleMessage);
      socket.off("timer", handleTimer);
      socket.off("updateUsers", handleUsers);
      socket.off("roomEnded", handleEnd);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
      socket.off("receiveEmoji", handleEmoji);
    };
  }, []);

  const joinRoom = () => socket.emit("joinRoom");

  const sendMessage = () => {
    if (!message.trim() || !room) return;
    socket.emit("sendMessage", message);
    setMessage("");
  };
  const createRoom = (timer) => {
    socket.emit("createRoom", { timer });
  };
  const leaveRoom = () => {
    socket.emit("leaveRoom");

    leaveVoice();

    setRoom(null);
    setChat([]);
    setUsers([]);
    setTimer(60);
    setMessage("");
  };
  const joinByCode = (code) => {
    socket.emit("joinByCode", { code });
  };
  if (loading) {
    return (
      <div className="app-container">
        <h1>Connecting to Chaos...</h1>
      </div>
    );
  }
  if (!room) {
    return <Home joinRoom={joinRoom} createRoom={createRoom} joinByCode={joinByCode} />;
  }

  return (
    <>
      <div className="emoji-container">
        {emojis.map((e) => (
          <span
            key={e.id}
            className="emoji"
            style={{
              left: `${e.x}%`,
              transform: `scale(${e.scale}) rotate(${e.rotate}deg)`,
              animationDuration: `${e.duration}ms`
            }}
          >
            {e.emoji}
          </span>
        ))}
      </div>


      <Room
        room={room}
        users={users}
        timer={timer}
        chat={chat}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        joinVoice={joinVoice}
        leaveVoice={leaveVoice}
        toggleMute={toggleMute}
        inVoice={inVoice}
        muted={muted}
        speaking={speaking}
        socketId={socketId}
        sendEmoji={sendEmoji}
        leaveRoom={leaveRoom}
      />
    </>
  );
}

export default App;