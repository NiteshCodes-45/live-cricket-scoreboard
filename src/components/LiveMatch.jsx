import { useRef, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useSeriesAndMatches from "../hooks/useSeriesAndMatches";
import noLiveMatchesImg from "/src/assets/no-live-matches.png";
import Loader from "../components/Loader";

const LiveMatch = ({ matchId = "abc123" }) => {
  const [matchData, setMatchData] = useState(null);
  const { allSeries, allMatches } = useSeriesAndMatches();
  const [loading, setLoading] = useState(true);

  const viewMatchScoreboard = (viewMatchId) =>{
    
    const matchRef = doc(db, "matches", viewMatchId);

    const unsubscribe = onSnapshot(matchRef, (docSnap) => {
      if (docSnap.exists()) {
        setMatchData(docSnap.data());
      } else {
        console.log("No such match document!");
      }
    });
    return () => unsubscribe();
  };
  
  // useEffect(() => {
  //   const matchRef = doc(db, "matches", matchId);

  //   const unsubscribe = onSnapshot(matchRef, (docSnap) => {
  //     if (docSnap.exists()) {
  //       setMatchData(docSnap.data());
  //     } else {
  //       console.log("No such match document!");
  //     }
  //   });

  //   return () => unsubscribe(); // 🧹 Clean up on unmount
  // }, [matchId]);

  const scrollRef = useRef(null);

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300, // amount to scroll (in pixels)
      behavior: "smooth",
    });
  };

  // if (loading) return <Loader />;

    return (
        <>
        {/* List of matches */}
        
        <div className="relative w-full">
        {/* Scrollable match list */}
        <div ref={scrollRef} className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
            {allMatches.map((match) => (
                <div key={match.id} className="min-w-[240px] bg-white rounded-2xl shadow-lg p-4 flex-shrink-0 border border-gray-200 hover:shadow-xl transition duration-300">
                {/* Series Name */}
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-4">{match.seriesName}</p>
              
                {/* Match Display */}
                {match.matchStatus === "Live" ? (
                  <>
                    {/* Team A */}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">{match.teamA}</h4>
                      <h4 className="text-sm font-mono text-gray-700">
                        {match.scores.teamA} / {match.wicket.teamA}{" "}
                        <span className="text-xs text-gray-500">({match.activeOverUpdate.teamA})</span>
                      </h4>
                    </div>
              
                    {/* Team B */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">{match.teamB}</h4>
                      <h4 className="text-sm font-mono text-gray-700">
                        {match.scores.teamB} / {match.wicket.teamB}{" "}
                        <span className="text-xs text-gray-500">({match.activeOverUpdate.teamB})</span>
                      </h4>
                    </div>
                  </>
                ) : (
                  <h3 className="text-base font-bold text-gray-800 mb-4">
                    {match.teamA} <span className="text-gray-400">vs</span> {match.teamB}
                  </h3>
                )}
              
                {/* Toss Info */}
                {match.winner === "" ? (
                  match.tossWin && match.optTo && (
                    <p className="text-xs text-gray-600 mb-2 italic">
                      {match.tossWin} won the toss and opted to {match.optTo.toLowerCase()}
                    </p>
                  )
                ) : (
                  <p className="text-xs text-gray-600 mb-4 italic">{match.winner}</p>
                )}
              
                {/* Match Status */}
                <>
                <div className="flex items-center justify-between">
                {match.winner == "" || match.matchStatus === "Upcoming" ?
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                      match.matchStatus === "Live"
                        ? "bg-red-100 text-red-600"
                        : match.matchStatus === "Upcoming"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                  { match.matchStatus }
                  </span> : "" }
                  { match.matchStatus === "Live" ? <a href="#" onClick={(e)=> viewMatchScoreboard(match.id)} className="inline-block text-xs font-semibold py-1 rounded-full">Scoreboard</a> : "" }
                </div>
                </>
              </div>              
            ))}
        </div>
        
        { allMatches.length == 0 ?
          <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
            <img src={noLiveMatchesImg} alt="No Matches" className="w-60 mb-4" />
            {/* <h2 className="text-xl font-semibold">No live matches right now</h2> */}
            <h2 className="text-xl font-semibold mt-2">Stay tuned for upcoming matches!</h2>
          </div> : ""
        } 

        {/* Scroll right button */}
        { allMatches.length > 5 ?
        <button onClick={scrollRight} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700" > ➡️</button> : "" }
        </div> 
        
        {/* End of list */}
        {matchData ? (
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
        )}
        </>
    )
}
export default LiveMatch;
