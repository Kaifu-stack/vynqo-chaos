import { useState } from "react";

export default function Home({ joinRoom, createRoom, joinByCode }) {
    const [timer, setTimer] = useState(60);
    const [code, setCode] = useState("");

    return (
        <div className="app-container">
            <div className="home-card">
                <h1>🔥Chaos</h1>

                <button onClick={joinRoom}>
                    Enter Random Chaos (5 min)
                </button>

                <hr />

                {/* CREATE ROOM */}
                <h3>Create Your Room</h3>

                <select
                    value={timer}
                    onChange={(e) => setTimer(Number(e.target.value))}
                >
                    <option value={60}>1 min</option>
                    <option value={120}>2 min</option>
                    <option value={300}>5 min</option>
                    <option value={600}>10 min</option>
                </select>

                <button onClick={() => createRoom(timer)}>
                    Create Room
                </button>

                <hr />

                {/* JOIN BY CODE */}
                <h3>Join with Code</h3>

                <input
                    placeholder="Enter room code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                />

                <button
                    onClick={() => {
                        if (!code.trim()) return;
                        joinByCode(code);
                    }}
                >
                    Join Room
                </button>
                <p style={{ opacity: 0.6, fontSize: "12px" }}>
                    Meet random people. Debate fast. Leave anytime.
                </p>
            </div>
        </div>
    );
}