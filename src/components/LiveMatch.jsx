import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const LiveMatch = ({ matchId = "abc123" }) => {
  const [matchData, setMatchData] = useState(null);

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
        {matchData ? (
            <div className="bg-gray-100 mt-4 p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-2">Live Scoreboard</h2>
                <div className="my-2 py-2">
                    { matchData.tossWin != "" ? <h5 className="text-sm font-semibold">{matchData.tossWin} won the toss and opt to {matchData.optTo.toLowerCase()} </h5> : "" }
                    {/* { battingTeam != "" ? <h2 className="text-xl font-bold mt-4"> {currentInning === 1 ? "First Inning in Progress" : "Second Inning in Progress"} </h2> : "" } */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 border-stone-400 border-1 p-2 rounded bg-stone-300">
                            <div>
                                <h4 className="text-lg font-semibold">{matchData.teams.teamA}</h4>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold float-right">{matchData.scores.teamA} / {matchData.wicket.teamA} ({matchData.overs} Overs)</h4>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-stone-400 border-1 p-2 rounded bg-stone-300">
                            <div>
                                <h4 className="text-lg font-semibold">{matchData.teams.teamB}</h4>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold float-right">{matchData.scores.teamB} / {matchData.wicket.teamB} ({matchData.overs} Overs)</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50">
                        <h3 className="text-lg font-semibold">{matchData.teams.teamA} Players</h3>
                    </div>
                    <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50">
                        <h3 className="text-lg font-semibold">{matchData.teams.teamB} Players</h3>
                    </div>
                </div>
            </div>
        ) : (
            <p>Loading match data...</p>
        )}
        </>
    )
}
export default LiveMatch;
