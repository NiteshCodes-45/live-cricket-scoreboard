import { useEffect, useState } from "react";
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

    return (
        <>
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
                            <div className="border-1 border-sky-500/50 px-2">
                                <ul className="mt-4">
                                {matchData.players[team].map((player, index) => (
                                    <li key={index} className="py-1">
                                    {player.name || `Player ${index + 1}`} - {player.runs} Runs
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
