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
                    
                    { matchData.battingTeam != "" ? 
                    <div class="text-center">
                        <h2 class="text-lg font-bold text-red-600"> 
                            {matchData.currentInning === 1 ? "First Inning in Progress" : "Second Inning in Progress"} 
                        </h2>
                    </div> : "" }
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 border-stone-400 border-1 p-2 rounded bg-stone-300">
                            <div>
                                <h4 className="text-lg font-semibold">{matchData.teams.teamA}</h4>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold float-right">{matchData.scores.teamA} / {matchData.wicket.teamA} ( { matchData.activeOverUpdate.teamA } Overs)</h4>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-stone-400 border-1 p-2 rounded bg-stone-300">
                            <div>
                                <h4 className="text-lg font-semibold">{matchData.teams.teamB}</h4>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold float-right">{matchData.scores.teamB} / {matchData.wicket.teamB} ( { matchData.activeOverUpdate.teamB } Overs)</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 px-4 py-3 gap-4">
                    <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50">
                        <h3 className="text-lg font-semibold">{matchData.teams.teamA} Players</h3>
                    </div>
                    <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50">
                        <h3 className="text-lg font-semibold">{matchData.teams.teamB} Players</h3>
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
