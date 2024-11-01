export type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leaveAlone" | "closeMatching";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};
