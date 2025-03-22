import { useState } from "react";

function LiveMatchUpdate({ isAdmin }) {
  const [teams, setTeams] = useState({ teamA: "Team A", teamB: "Team B" });
  const [overs, setOvers] = useState("");
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [overDetails, setOverDetails] = useState({ teamA: [], teamB: [] });
  const [activeOver, setActiveOver] = useState({ teamA: 0, teamB: 0 });
  const [tossWin, setTossWin] = useState("");
  const [optTo, setOptTo] = useState("");

  const [activeOverUpdate, setActiveOverUpdate] = useState("0.0");

  const [players, setPlayers] = useState({
    teamA: Array(11).fill({ name: "", runs: 0, ballsFaced:0 }),
    teamB: Array(11).fill({ name: "", runs: 0, ballsFaced:0 })
  });

  const handleTeamChange = (team, value) => {
    setTeams({ ...teams, [team]: value });
  };

  const handleOverChange = (value) => {
    setOvers(value);
    setOverDetails({
      teamA: Array.from({ length: value }, () => Array(6).fill("")),
      teamB: Array.from({ length: value }, () => Array(6).fill("")),
    });
  };

  //Update Overs 
  const updateOver = (team, overIndex, ballIndex, value) => {
    let newBallIndex = ballIndex;
  
    // Fetch previous ball (if exists)
    const previousBall = overDetails[team][overIndex][ballIndex - 1] || "";
  
    // If the previous ball was No Ball or Wide Ball, keep the same ball index
    if (previousBall.toLowerCase() === "no ball" || previousBall.toLowerCase() === "wide ball") {
      newBallIndex = ballIndex;
    } else {
      // If current ball is No Ball or Wide Ball, do not count it in ball progress
      if (value.toLowerCase() !== "no ball" && value.toLowerCase() !== "wide ball" && value !== "") {
        newBallIndex = ballIndex + 1;
      }
    }
  
    // Update state with the new over progress
    setActiveOverUpdate(`${overIndex}.${newBallIndex}`);
  };

  //Update score each over(Ball By Ball)
  const handleBallUpdate = (team, overIndex, ballIndex, value) => {
    if (overIndex > activeOver[team]) return; // Prevent input in inactive overs
    
    updateOver(team, overIndex, ballIndex, value);
    
    const updatedOvers = [...overDetails[team]];
    updatedOvers[overIndex][ballIndex] = value;
  
    // Extend the over if No Ball or Wide Ball is entered
    if (value.toLowerCase() === "no ball" || value.toLowerCase() === "wide ball") {
      updatedOvers[overIndex].push(""); // Adds an extra input for the over
    }
  
    // Count valid (legal) deliveries
    const validBalls = updatedOvers[overIndex].filter(
      (ball) => ball.toLowerCase() !== "no ball" && ball.toLowerCase() !== "wide ball" && ball !== ""
    );
  
    // Move to next over only if 6 valid deliveries are completed & it's the active over
    if (validBalls.length === 6 && overIndex === activeOver[team] && overIndex < overs - 1) {
      setActiveOver((prev) => ({ ...prev, [team]: overIndex + 1 }));
    }
  
    setOverDetails({ ...overDetails, [team]: updatedOvers });
  
    // Calculate total score
    let totalScore = 0;
    updatedOvers.forEach((over) => {
      over.forEach((run) => {
        if (!isNaN(run) && run !== "") totalScore += Number(run);
        if (run.toLowerCase() === "no ball" || run.toLowerCase() === "wide ball") totalScore += 1;
      });
    });
  
    setScores({ ...scores, [team]: totalScore });
  };

  // Handle player score update
  const handleScoreUpdate = (team, index, field, value) => {
    const updatedPlayers = players[team].map((player, i) =>
      i === index ? { ...player, [field]: value } : player
    );
    setPlayers({ ...players, [team]: updatedPlayers });

    // // Update total score for the team
    // const totalScore = updatedPlayers.reduce((sum, p) => sum + Number(p.runs), 0);
    // setScores({ ...scores, [team]: totalScore });

  };

  return (
    <div className="container mx-auto p-4">
      {/* First Section */}
      <div className="bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-2">Live Scoreboard</h2>
        <div className="border-b-2 my-2 py-2">
          <h4 className="text-lg font-semibold">{teams.teamA} Vs {teams.teamB}</h4>
          <h5 className="text-sm font-semibold">Overs: {activeOverUpdate}</h5>
          {tossWin != "" ? <h5 className="text-sm font-semibold">{tossWin} won the toss and opt to {optTo.toLowerCase()} </h5> : "" }
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold">{teams.teamA} - {scores.teamA} Runs</h3>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{teams.teamB} - {scores.teamB} Runs</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Team A */}
          <div>
            <ul className="mt-4">
              {players.teamA.map((player, index) => (
                <li key={index} className="border-b py-1">
                  {player.name || `Player ${index + 1}`} - {player.runs} Runs
                </li>
              ))}
            </ul>
          </div>

          {/* Team B */}
          <div>
            <ul className="mt-4">
              {players.teamB.map((player, index) => (
                <li key={index} className="border-b py-1">
                  {player.name || `Player ${index + 1}`} - {player.runs} Runs
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    
    {/* Second Section */}
    {isAdmin && (
      <div className="mt-6 bg-white p-4 rounded shadow-md">
        <h3 className="text-xl font-bold mb-2">Match Between</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Team A Name"
            value={teams.teamA}
            onChange={(e) => handleTeamChange("teamA", e.target.value)}
            className="border p-2 w-1/2"
          />
          <input
            type="text"
            placeholder="Team B Name"
            value={teams.teamB}
            onChange={(e) => handleTeamChange("teamB", e.target.value)}
            className="border p-2 w-1/2"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
            {/* Match Overs */}
            <div className="w-full md:w-auto md:mr-8">
                <h2 className="text-xl font-bold mt-6">Overs</h2>
                <input
                type="number"
                placeholder="Total Overs"
                value={overs}
                onChange={(e) => handleOverChange(e.target.value)}
                className="border p-2 w-full"
                />
            </div>

            {/* Toss Time */}
            <div className="w-full md:w-auto md:mr-8">
                <h2 className="text-l font-bold mt-8 mb-2">Toss Win By</h2>
                <label className="pr-2 block md:inline-block">
                <input
                    className="mr-2"
                    type="radio"
                    name="toss"
                    value={teams.teamA}
                    checked={tossWin === teams.teamA}
                    onChange={(e) => setTossWin(e.target.value)}
                />
                {teams.teamA}
                </label>
                <label className="pl-2 block md:inline-block">
                <input
                    className="mr-2"
                    type="radio"
                    name="toss"
                    value={teams.teamB}
                    checked={tossWin === teams.teamB}
                    onChange={(e) => setTossWin(e.target.value)}
                />
                {teams.teamB}
                </label>
            </div>

            {/* Winning team Opt to */}
            <div className="w-full md:w-auto md:ml-8">
                <h2 className="text-l font-bold mt-8 mb-2">and opt to</h2>
                <label className="pr-2 block md:inline-block">
                <input
                    className="mr-2"
                    type="radio"
                    name="opt_to"
                    value="Bat First"
                    checked={optTo === "Bat First"}
                    onChange={(e) => setOptTo(e.target.value)}
                />
                Bat First
                </label>
                <label className="pl-2 block md:inline-block">
                <input
                    className="mr-2"
                    type="radio"
                    name="opt_to"
                    value="Bowled First"
                    checked={optTo === "Bowled First"}
                    onChange={(e) => setOptTo(e.target.value)}
                />
                Bowled First
                </label>
            </div>
        </div>


        {/* Over Breakdown */}
        <h2 className="text-xl font-bold mt-6">Over Breakdown</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
        {Object.keys(overDetails).map((team) => (
          <div key={team} className="mt-4">
            <h3 className="text-lg font-semibold">{teams[team]}</h3>
            {overDetails[team].map((over, overIndex) => (
              <div key={overIndex} className="mt-2">
                <h4 className="font-semibold">Over {overIndex + 1}</h4>
                <div className="flex space-x-2">
                  {over.map((ball, ballIndex) => (
                    <input
                      max={6}
                      key={ballIndex}
                      type="text"
                      placeholder={`Ball ${ballIndex + 1}`}
                      value={ball}
                      onKeyUp={(e) => {
                        if (parseInt(e.target.value) > 6) {
                          e.target.value = ""; // Reset value if greater than 6
                        }
                      }}
                      onChange={(e) => handleBallUpdate(team, overIndex, ballIndex, e.target.value)}
                      className={`border p-1 w-12 text-center ${
                        overIndex > activeOver[team] || (tossWin === teams[team] && optTo === "Bat First") ? "bg-gray-300 cursor-not-allowed" : ""
                      }`}
                      disabled={overIndex > activeOver[team] || (tossWin === teams[team] && optTo === "Bat First")}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        </div>

        {/* Update Scores Manually */}
        <h2 className="text-xl font-bold mt-6">Players Name & Score</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Object.keys(players).map((team) => (
            <div key={team}>
              <h3 className="text-lg font-semibold">{teams[team]}</h3>
              {players[team].map((player, index) => (
                <div key={index} className="flex items-center space-x-2 py-1">
                  <input
                    type="text"
                    placeholder={`Player ${index + 1} Name`}
                    value={players[team][index].name}
                    onChange={(e) => handleScoreUpdate(team, index, "name", e.target.value)}
                    className={`border p-1 w-1/2 ${
                      tossWin !== teams[team] || optTo !== "Bat First" ? "bg-gray-300 cursor-not-allowed" : ""
                    }`}
                    disabled={tossWin !== teams[team] || optTo !== "Bat First"}
                  />
                  <input
                    type="number"
                    placeholder="Runs"
                    value={players[team][index].runs}
                    onChange={(e) => handleScoreUpdate(team, index, "runs", e.target.value)}
                    className={`border p-1 w-16 ${
                      tossWin !== teams[team] || optTo !== "Bat First" ? "bg-gray-300 cursor-not-allowed" : ""
                    }`}
                    disabled={tossWin !== teams[team] || optTo !== "Bat First"}
                  />
                  {/* <input
                    type="number"
                    placeholder="Ball Faced"
                    value={players[team][index].ballsFaced}
                    onChange={(e) => handleScoreUpdate(team, index, "ballsFaced", e.target.value)}
                    className={`border p-1 w-16 ${
                      tossWin !== teams[team] || optTo !== "Bat First" ? "bg-gray-300 cursor-not-allowed" : ""
                    }`}
                    disabled={tossWin !== teams[team] || optTo !== "Bat First"}
                  /> */}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    )}
    </div>
  );
}

export default LiveMatchUpdate;