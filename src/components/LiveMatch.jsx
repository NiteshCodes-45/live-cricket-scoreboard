import { useRef, useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const LiveMatch = ({ matchId = "abc123" }) => {
  const [matchData, setMatchData] = useState(null);
  console.log(matchData);
  // 🔄 Real-time listener
  useEffect(() => {
    const matchRef = doc(db, "matches", matchId);

    const unsubscribe = onSnapshot(matchRef, (docSnap) => {
      if (docSnap.exists()) {
        setMatchData(docSnap.data());
      } else {
        console.log("No such match document!");
      }
    });

    return () => unsubscribe(); // 🧹 Clean up on unmount
  }, [matchId]);
  const scrollRef = useRef(null);

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300, // amount to scroll (in pixels)
      behavior: "smooth",
    });
  };

  const matches = [
    { id: 1, team1: "ABC", team2: "DEF", status: "In Progress" },
    { id: 2, team1: "GHI", team2: "JKL", status: "Upcoming" },
    { id: 3, team1: "MNO", team2: "PQR", status: "Completed" },
    { id: 4, team1: "STU", team2: "VWX", status: "In Progress" },
    { id: 5, team1: "YZA", team2: "BCD", status: "Upcoming" },
  ];

    return (
        <>
        {/* List of matches */}
        
        <div className="relative w-full" hidden>
        {/* Scrollable match list */}
        <div ref={scrollRef} className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
            {matches.map((match) => (
                <div key={match.id} className="min-w-[200px] bg-white border rounded-xl shadow p-4 flex-shrink-0">
                    <h3 className="text-lg font-bold text-center mb-1"> {match.team1} 🆚 {match.team2} </h3>
                    <p className="text-center text-sm text-gray-600">{match.status}</p>
                </div>
            ))}
        </div>

        {/* Scroll right button */}
        <button onClick={scrollRight} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700" > ➡️</button>
        </div>
        
        {/* End of list */}
        {matchData && matchData.optTo ? (
            <div className="bg-gray-100 mt-4 p-4 rounded shadow-md">
                <h2 class="text-2xl font-extrabold text-center text-gray-800 mb-4">{matchData.teams.teamA} 🆚 {matchData.teams.teamB}</h2>
                <div className="bg-gray-100 rounded-lg px-4 py-3 mb-4">
                    { matchData.tossWin != "" ? 
                    <h5 className="text-base font-medium text-gray-700 text-center">
                        <span class="font-semibold text-blue-600">
                            {matchData.tossWin} won the toss and opt to {matchData.optTo.toLowerCase()} 
                        </span>
                    </h5> : "" }
                    { matchData.winner == "" ? <div class="text-center">
                    { matchData.battingTeam != "" ? <h2 class="text-lg font-bold text-red-600"> {matchData.currentInning === 1 ? "First Inning in Progress" : "Second Inning in Progress"} </h2> : "" }
                    </div> : <div class="text-center py-2"><p className="text-violet-500 font-semibold text-lg rounded py-2">{matchData.winner} Congratulations 🎉</p></div> }

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className={`grid grid-cols-3 gap-4 border-stone-400 border-1 p-2 rounded ${matchData.battingTeam == matchData.teams.teamA ? "bg-green-300" : "bg-stone-300" }`}>
                            <div className="col-span-1">
                                <h4 className="text-sm font-semibold">{matchData.teams.teamA}</h4>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-sm font-semibold float-right">{matchData.scores.teamA} / {matchData.wicket.teamA} ( { matchData.activeOverUpdate.teamA } Overs)</h4>
                            </div>
                        </div>
                        <div className={`grid grid-cols-3 gap-4 border-stone-400 border-1 p-2 rounded ${matchData.battingTeam == matchData.teams.teamB ? "bg-green-300" : "bg-stone-300" }`}>
                            <div className="col-span-1">
                                <h4 className="text-sm font-semibold">{matchData.teams.teamB}</h4>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-sm font-semibold float-right">{matchData.scores.teamB} / {matchData.wicket.teamB} ( { matchData.activeOverUpdate.teamB } Overs)</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 gap-4">
                    <div className="grid md:grid-cols-4 gap-4">
                    {Object.keys(matchData.players).map((team) => (
                        <div className="col-span-2" key={team}>
                            <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50 text-center">
                                <h3 className="text-sm font-semibold">Team {matchData.teams[team]} Players</h3>
                            </div>
                            <div className="border-1 border-sky-500/50 px-2 py-2">
                                <ul className="mt-4">
                                {matchData.players[team].map((player, index) => (
                                    <li key={index} className="py-1 border-b-1">
                                    {<label className="text-[16px] font-semibold">{player.name}</label> || `Player ${index + 1}`} | {player.runs} Runs | {player.ballsFaced} Balls
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                
            </div>
        ) : (
            <div className="text-center mt-5">
                <p>Loading match data...</p>
            </div>
        )}
        </>
    )
}
export default LiveMatch;
