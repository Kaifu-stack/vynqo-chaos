import { useRef, useState } from "react";
import { socket } from "../socket/socket";

export default function useWebRTC(users) {
    const peers = useRef({});
    const localStream = useRef(null);
    const remoteAudios = useRef([]);

    const [inVoice, setInVoice] = useState(false);
    const [muted, setMuted] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    let audioContext;
    let analyser;
    let dataArray;

    //  SPEAKING DETECTION
    const detectSpeaking = () => {
        if (!localStream.current) return;

        audioContext = new AudioContext();

        const source =
            audioContext.createMediaStreamSource(
                localStream.current
            );

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        source.connect(analyser);

        dataArray = new Uint8Array(
            analyser.frequencyBinCount
        );

        const check = () => {
            analyser.getByteFrequencyData(dataArray);

            const volume =
                dataArray.reduce((a, b) => a + b, 0) /
                dataArray.length;

            setSpeaking(volume > 20);

            requestAnimationFrame(check);
        };

        check();
    };

    // CREATE PEER
    const createPeer = (userId) => {

        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        });

        // ❄️ ICE
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("ice-candidate", {
                    candidate: e.candidate,
                    to: userId
                });
            }
        };

        // 🔊 RECEIVE AUDIO
        pc.ontrack = (e) => {

            console.log("TRACK RECEIVED");

            const audio = document.createElement("audio");

            audio.srcObject = e.streams[0];

            audio.autoplay = true;
            audio.controls = true;

            audio.style.display = "none";

            document.body.appendChild(audio);

            audio.play()
                .then(() => {
                    console.log("Audio playing");
                })
                .catch((err) => {
                    console.log("Playback failed:", err);
                });

            remoteAudios.current.push(audio);
        };

        return pc;
    };
    // 🎤 JOIN VOICE
    const joinVoice = async () => {
        if (inVoice) return;

        try {
            localStream.current =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });

            detectSpeaking();

            // connect to every user
            for (const user of users) {
                if (user.id === socket.id) continue;

                const pc = createPeer(user.id);

                // add tracks
                localStream.current
                    .getTracks()
                    .forEach((track) => {
                        pc.addTrack(
                            track,
                            localStream.current
                        );
                    });

                // create offer
                const offer =
                    await pc.createOffer();

                await pc.setLocalDescription(
                    offer
                );

                socket.emit("offer", {
                    offer,
                    to: user.id
                });

                peers.current[user.id] = pc;
            }

            setInVoice(true);

            console.log("Voice joined");
        } catch (err) {
            console.log(
                "Microphone access denied:",
                err
            );
        }
    };

    // 🚪 LEAVE VOICE
    const leaveVoice = () => {
        // close peers
        Object.values(peers.current).forEach(
            (pc) => pc.close()
        );

        peers.current = {};

        // stop mic
        if (localStream.current) {
            localStream.current
                .getTracks()
                .forEach((t) => t.stop());
        }

        // remove audios
        remoteAudios.current.forEach((audio) => {
            audio.pause();
            audio.srcObject = null;
            audio.remove();
        });

        remoteAudios.current = [];

        setInVoice(false);
        setSpeaking(false);

        console.log("Voice left");
    };

    //  MUTE
    const toggleMute = () => {
        if (!localStream.current) return;

        localStream.current
            .getAudioTracks()
            .forEach((track) => {
                track.enabled = muted;
            });

        setMuted(!muted);
    };

    return {
        joinVoice,
        leaveVoice,
        toggleMute,
        inVoice,
        muted,
        speaking,
        peers
    };
}
