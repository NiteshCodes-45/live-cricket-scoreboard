import { useRef } from "react";
import useSeriesAndMatches from "../hooks/useSeriesAndMatches";
//import noLiveMatchesImg from "/src/assets/no-live-matches.png";
import { Link } from 'react-router-dom';

const LiveMatch = ({ matchId = "abc123" }) => {
  const { allMatches, loading } = useSeriesAndMatches();
  //allSeries,

  const scrollRef = useRef(null);

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const upcomingOrLiveMatches = allMatches.filter(
  match =>
    match.matchStatus === "Upcoming" ||
    (match.matchStatus === "Live" && match.winner === "")
  );

  const upcomingLiveMatchesCount = upcomingOrLiveMatches.length;


    return (
        <>
        {/* List of matches */}
        <section className="text-center py-12">
          <h1
            style={{
              animation: 'bounceOnce 1s ease-out forwards',
            }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text"
          >
            Live Cricket Scores
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Track real-time match updates, series info, and player performance
          </p>
        </section>
        <section className="my-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text mb-2">
            Live Matches
          </h2>
          <div className="relative w-full">
          {/* Scroll Left button */}
          { upcomingLiveMatchesCount > 4 ?
          <button
            onClick={scrollLeft}
            className="absolute left-[-1.2rem] top-1/2 -translate-y-1/2 bg-gradient-to-l from-orange-300 to-pink-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow hover:opacity-90 transition"
          >
            &lt;
          </button> : "" }
          {/* Scrollable match list */}
          <div ref={scrollRef} className="flex overflow-x-auto md:overflow-x-hidden space-x-4 py-4 px-1 scrollbar-hide">
              {allMatches
              .filter(
                match =>
                  match.matchStatus === "Upcoming" ||
                  (match.matchStatus === "Live" && match.winner === ""))
              .map((match) => (
                  <div key={match.id} className="min-w-[24%] bg-[#fffbf5] rounded-2xl shadow-lg py-4 px-6 flex-shrink-0 border border-gray-200 hover:shadow-xl transition duration-300 md:bg-desktop">
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
                    { match.matchStatus === "Live" ? 
                    // <a href="#" onClick={(e)=> viewMatchScoreboard(match.id)} className="inline-block text-xs font-semibold py-1 rounded-full">Scoreboard</a> 
                    <Link
                        to={`/single-live-match/${match.id}`}
                        className="inline-block text-xs font-semibold py-1 rounded-full"
                      >
                        Scoreboard
                      </Link>
                    : "" }
                  </div>
                  </>
                </div>              
              ))}
          </div>
          
          { loading && allMatches.length == 0 ?
            <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
              {/* <img src={noLiveMatchesImg} alt="No Matches" className="w-60 mb-4" /> */}
              <h2 className="text-xl font-semibold mt-2">Fetching live matches stay tune...</h2>
            </div> : ""
          } 

          {/* Scroll right button */}
          { upcomingLiveMatchesCount > 4 ?
          <button
            onClick={scrollRight}
            className="absolute right-[-1.2rem] top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-300 to-pink-500 text-white text-base font-bold w-10 h-10 flex items-center justify-center rounded-full shadow hover:opacity-90 transition"
          > &gt; </button> : "" }
          </div> 
        </section>
        {/* End of list */}

        { allMatches.length != 0 ?
          <section className="my-12">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text mb-6">
              Recent Matches
            </h2>
            <div className="relative w-full">
              <div className="flex overflow-x-auto md:overflow-x-hidden space-x-4 pb-2 scrollbar-hide">
                {allMatches
                .filter(
                  match =>
                    match.matchStatus === "Live" && match.winner != "")
                .map((match) => (
                    <div key={match.id} className="min-w-[24%] bg-[#fffbf5] rounded-2xl shadow-lg p-4 flex-shrink-0 border border-gray-200 hover:shadow-xl transition duration-300 md:bg-desktop">
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
                      { match.matchStatus === "Live" ? 
                      // <a href="#" onClick={(e)=> viewMatchScoreboard(match.id)} className="inline-block text-xs font-semibold py-1 rounded-full">Scoreboard</a> 
                      <Link
                        to={`/single-live-match/${match.id}`}
                        className="inline-block text-xs font-semibold py-1 rounded-full"
                      >
                        Scoreboard
                      </Link>
                      : "" }
                    </div>
                    </>
                  </div>              
                ))}
              </div>
            </div>  
          </section> : ""
        }

        {/* About Section */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text mb-4">
            What is Live Score Cart?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            A lightweight live cricket scoring system built for local matches and series, supporting real-time updates.
          </p>
        </section>
        </>
    )
}
export default LiveMatch;
