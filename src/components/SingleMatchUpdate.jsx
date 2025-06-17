import { useEffect, useState } from "react";
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
            <div className="mt-4 px-55 py-4">
                <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-4">{matchData.teams.teamA} 🆚 {matchData.teams.teamB}</h2>
                <div className="rounded-lg px-4 py-3 mb-4">
                    { matchData.tossWin != "" ? 
                    <h5 className="text-base font-medium text-gray-700 text-center">
                        <span className="font-semibold text-blue-600">
                            {matchData.tossWin} won the toss and opt to {matchData.optTo.toLowerCase()} 
                        </span>
                    </h5> : "" }
                    { matchData.winner == "" ? <div className="text-center">
                    { matchData.battingTeam != "" ? <h2 className="text-lg font-bold text-red-600"> {matchData.currentInning === 1 ? "First Inning in Progress" : "Second Inning in Progress"} </h2> : "" }
                    </div> : <div className="text-center py-2"><p className="text-violet-500 font-semibold text-lg rounded py-2">{matchData.winner}</p></div> }
                </div>

                <div className="px-4 gap-4">
                    <div className="flex flex-col gap-4">
                    {Object.keys(matchData.players).map((team) => (
                        <div className="col-span-2" key={team}>
                            <div className={`grid grid-cols-3 gap-4 border-stone-400 border-1 p-2 rounded ${
                            matchData.battingTeam === (team === "teamA" ? matchData.teams.teamA : matchData.teams.teamB)
                                ? "bg-green-300"
                                : "bg-stone-300"
                            }`}>
                                <div className="col-span-1">
                                    <h4 className="text-sm font-semibold">
                                        {team === "teamA" ? matchData.teams.teamA : matchData.teams.teamB}
                                    </h4>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="text-sm font-semibold float-right">
                                        {team === "teamA" ? matchData.scores.teamA : matchData.scores.teamB} / {team === "teamA" ? matchData.wicket.teamA : matchData.wicket.teamB} ( {team === "teamA" ? matchData.activeOverUpdate.teamA : matchData.activeOverUpdate.teamB} Overs)</h4>
                                </div>
                            </div>
                            <div className="border-1 border-sky-500/50 px-2 py-2 mt-2">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2">
                                        <th className="py-2 px-4 text-[16px] font-bold">Batter</th>
                                        <th className="py-2 px-4 text-[16px] font-bold">Runs</th>
                                        <th className="py-2 px-4 text-[16px] font-bold">Balls</th>
                                        <th className="py-2 px-4 text-[16px] font-bold">SR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matchData.players[team]
                                        .filter((player) => player.name.trim() !== "")
                                        .map((player, index) => (
                                            <tr key={index} className="border-b">
                                            <td className="py-1 px-4 text-[16px] font-semibold">{player.name}</td>
                                            <td className="py-1 px-4">{player.runs}</td>
                                            <td className="py-1 px-4">{player.ballsFaced}</td>
                                            {/* Strike Rate = (Total Runs Scored / Total Balls Faced) * 100  */}
                                            <td className="py-1 px-4">{((player.runs / player.ballsFaced ) * 100).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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