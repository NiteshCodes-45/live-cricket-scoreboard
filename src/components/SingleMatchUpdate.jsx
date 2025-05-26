import { useRef, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useParams, Link } from "react-router-dom";

function SingleMatchUpdate(){
    const [matchData, setMatchData] = useState(null);
    const { matchId } = useParams();  

    useEffect(() => {
        if (!matchId) return;

        const matchRef = doc(db, "matches", matchId);
        const unsubscribe = onSnapshot(matchRef, (docSnap) => {
            if (docSnap.exists()) {
            setMatchData(docSnap.data());
            } else {
            console.log("No such match document!");
            }
        });
        return () => unsubscribe();
    }, [matchId]);

    return (
    <>
    {matchData ? (
            <div className="mt-4 p-4">
                <h2 class="text-2xl font-extrabold text-center text-gray-800 mb-4">{matchData.teams.teamA} 🆚 {matchData.teams.teamB}</h2>
                <div className="rounded-lg px-4 py-3 mb-4">
                    { matchData.tossWin != "" ? 
                    <h5 className="text-base font-medium text-gray-700 text-center">
                        <span class="font-semibold text-blue-600">
                            {matchData.tossWin} won the toss and opt to {matchData.optTo.toLowerCase()} 
                        </span>
                    </h5> : "" }
                    { matchData.winner == "" ? <div class="text-center">
                    { matchData.battingTeam != "" ? <h2 class="text-lg font-bold text-red-600"> {matchData.currentInning === 1 ? "First Inning in Progress" : "Second Inning in Progress"} </h2> : "" }
                    </div> : <div class="text-center py-2"><p className="text-violet-500 font-semibold text-lg rounded py-2">{matchData.winner}</p></div> }

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
                                {matchData.players[team]
                                  .filter((player) => player.name.trim() !== "")
                                  .map((player, index) => (
                                    <li key={index} className="py-1 border-b-1">
                                      <label className="text-[16px] font-semibold">{player.name}</label> | {player.runs} Runs | {player.ballsFaced} Balls
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
                {/* <p>Loading match data...</p> */}
            </div>
        )
    }
    </>
    )
}    
export default SingleMatchUpdate; 