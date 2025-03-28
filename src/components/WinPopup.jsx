import { useState, useEffect } from "react";

const [showPopup, setShowPopup] = useState(false);
const [winner, setWinner] = useState("");

useEffect(() => {
  if (currentInning === 2) {
    if (scores.teamA === scores.teamB) {
      setWinner("It's a Tie!");
      setShowPopup(true);
    } else if (wickets[battingTeam] === 10) {
      // 🏆 Determine the winning team
      let winningTeam = scores.teamA > scores.teamB ? "Team A" : "Team B";
      setWinner(`${winningTeam} Wins!`);
      setShowPopup(true);
    }
  }
}, [scores, wickets, currentInning]); // ✅ Runs whenever scores or wickets update

// 🏏 Tailwind-styled Popup Component
const MatchOverPopup = () => {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600">Match Over!</h2>
        <p className="text-lg text-gray-800 mt-2">{winner}</p>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// 🔥 Include this inside your main component
return (
  <>
    <MatchOverPopup />
    {/* Other UI components */}
  </>
);
