import { useState, useEffect, useCallback } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function LiveMatchUpdate({ isAdmin }) {
  const [teams, setTeams] = useState({ teamA: "", teamB: "" });
  const [overs, setOvers] = useState({ teamA: 0, teamB: 0 });
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [overDetails, setOverDetails] = useState({ teamA: [], teamB: [] });
  const [activeOver, setActiveOver] = useState({ teamA: 0, teamB: 0 });
  const [tossWin, setTossWin] = useState("");
  const [optTo, setOptTo] = useState("");
  const [wicket, setWickets] = useState(0);
  
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState("");
  
  const [currentInning, setCurrentInning] = useState(1); // 1 = First, 2 = Second
  const [battingTeam, setBattingTeam] = useState(""); // Track batting team
  const ballsPerOver = 6; // Legal balls per over

  const [activeOverUpdate, setActiveOverUpdate] = useState({ teamA: 0, teamB: 0 });

  // const [players, setPlayers] = useState({
  //   teamA: Array(11).fill({ name: "", runs: 0, ballsFaced:0 }),
  //   teamB: Array(11).fill({ name: "", runs: 0, ballsFaced:0 })
  // });

  const [players, setPlayers] = useState({
    teamA: Array.from({ length: 11 }, () => ({ name: "", runs: 0})),
    teamB: Array.from({ length: 11 }, () => ({ name: "", runs: 0})),
  });

  const matchId = "abc123";

  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedUpdate = useCallback(
    debounce((newData) => {
      updateMatchData(matchId, newData);
    }, 500),
    [matchId]
  );

  const debouncedUpdatePlayer = useCallback(
    debounce((newData) => {
      updatePlayerData(matchId, newData);
    }, 500),
    [matchId]
  );
  
  const updateMatchData = async (matchId, newData) => {
    try {
      const matchRef = doc(db, "matches", matchId);
      await setDoc(matchRef, newData, { merge: true }); //Will create or update
      console.log("Match data saved successfully!");
    } catch (error) {
      console.error("Error updating match data:", error);
    }
  };

  const updatePlayerData = async (matchId, newData) => {
    try {
      console.log("Players Score:", players);
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, newData);
      console.log("Player data saved successfully!");
    } catch (error) {
      console.error("Error updating player data:", error);
    }
  };

  useEffect(() => {
    const buildMatchUpdatePayload = () => ({
      optTo,
      battingTeam,
      currentInning,
      scores,
      wicket,
      activeOverUpdate,
      winner,
      updatedAt: new Date(),
    });
  
    debouncedUpdate(buildMatchUpdatePayload());
  }, [optTo, battingTeam, currentInning, activeOverUpdate, scores, wicket, winner, debouncedUpdate]);

  useEffect(() => {
    const buildPlayerUpdatePayload = () => ({
      players,
      updatedAt: new Date(),
    });
  
    debouncedUpdatePlayer(buildPlayerUpdatePayload());
  }, [players, debouncedUpdatePlayer]);

  useEffect(() => {
    if (tossWin && optTo) { // Only update when both values are set
      if (optTo === "Bat First") {
        setBattingTeam(tossWin); // Toss winner bats first
      } else {
        setBattingTeam(tossWin === teams.teamA ? teams.teamB : teams.teamA); // Other team bats first
      }
    }
  }, [tossWin, optTo, teams]); // Depend on teams too in case team names change
  
  useEffect(() => {
    if (currentInning === 2) {
      const firstInningScore = scores.teamA || 0;
      const secondInningScore = scores.teamB || 0;
      const secondTeamWickets = wicket.teamB || 0;
  
      if (secondInningScore > firstInningScore) {
        console.log(`${teams.teamB} Wins!`);
        setWinner(`${teams.teamB} Wins!`);
        setShowPopup(true);
      }else if (secondInningScore < firstInningScore) {
        console.log(`${teams.teamA} Wins!`);
        setWinner(`${teams.teamA} Wins! 🏆`);
        setShowPopup(true);
      }else if (secondInningScore === firstInningScore && secondTeamWickets === 10) {
        console.log("Match Tied!");
        setWinner("It's a Tie! 🤝");
        setShowPopup(true);
      }

      // else if (secondTeamWickets === 10 && secondInningScore < firstInningScore) {
      //   console.log(`${teams.teamA} Wins!`);
      //   setWinner(`${teams.teamA} Wins! 🏆`);
      //   setShowPopup(true);
      // }

    }
  }, [scores, wicket, currentInning, teams]); // Ensure effect re-runs on latest scores & wickets

  const handleTeamChange = (team, value) => {
    //setTeams({ ...teams, [team]: value });
    setTeams((prevTeams) => ({
      ...prevTeams,
      [team]: value,
    }));
  };

  const handleOverChange = (value) => {
    setOvers(value);
    setOverDetails({
      teamA: Array.from({ length: value }, () => Array(6).fill("")),
      teamB: Array.from({ length: value }, () => Array(6).fill("")),
    });
    debouncedUpdate({
      teams,
      overs: value,
      tossWin,
      optTo,
      scores,
      wicket,
      updatedAt: new Date(),
    });
  };

  //Update Overs 
  const updateOver = (team, overIndex, ballIndex, value) => {
    let newBallIndex = ballIndex;
  
    // Clone existing overs to avoid direct state mutation
    const updatedOvers = [...overDetails[team]];
  
    // Fetch previous ball (if exists)
    const previousBall = overDetails[team][overIndex]?.[ballIndex - 1] || "";
  
    // If the previous ball was No Ball or Wide Ball, keep the same ball index
    if (previousBall.toLowerCase() === "no ball" || previousBall.toLowerCase() === "wide ball") {
      newBallIndex = ballIndex;
    } else {
      // If current ball is NOT No Ball or Wide Ball, increment ball index
      if (value.toLowerCase() !== "no ball" && value.toLowerCase() !== "wide ball" && value !== "") {
        newBallIndex = ballIndex + 1;
      }
    }
  
    // Update the ball entry in the team's overs
    updatedOvers[overIndex][ballIndex] = value;
  
    // Update the state with the new overs
    setOverDetails((prev) => ({
      ...prev,
      [team]: updatedOvers,
    }));
  
    // Set the active over tracking state
    setActiveOverUpdate((prev) => ({
      ...prev,
      [team]: `${overIndex}.${newBallIndex}`,
    }));
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
  
    // Calculate total score and total valid balls
    let totalScore = 0;
    let totalWickets = 0;
    let totalValidBalls = 0; // track valid deliveries

    updatedOvers.forEach((over) => {
      over.forEach((run) => {
        if (!isNaN(run) && run !== "") {
          totalScore += Number(run);
          totalValidBalls += 1; // Count only legal deliveries
        }

        if (run.toLowerCase() === "no ball" || run.toLowerCase() === "wide ball") {
          totalScore += 1; // Extras count towards score
        } else if (run.toLowerCase() === "w") {
          totalWickets += 1; // Count wickets
          totalValidBalls += 1; // Wicket is a legal ball
        }
      });
    });

    // Check if set overs are completed   
    console.log("Inning:: "+totalValidBalls+"Total Balls: "+(overs * ballsPerOver));
    if (totalValidBalls >= overs * ballsPerOver) {
      console.log("First Inning Done! Switching teams...");
      
      // Switch to the next inning
      setCurrentInning(2);
      setBattingTeam(battingTeam === teams.teamA ? teams.teamB : teams.teamA);
    }

    setScores((prevScores) => {
      const newScores = { ...prevScores, [team]: totalScore };
      //console.log("Updated Scores:", newScores);
      return newScores;
    });

    setWickets((prevWickets) => {
      const newWickets = { ...prevWickets, [team]: totalWickets };
      //console.log("Updated Wickets:", newWickets);
      debouncedUpdate({
        teams,
        overs,
        tossWin,
        scores,
        wicket: newWickets,
        updatedAt: new Date(),
      });
      return newWickets;
    });
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

    debouncedUpdate({
      players:players,
      updatedAt: new Date(),
    });

  };

  // Validation Functions
  const cleanInput = (value) => {
    return value.replace(/[^a-zA-Z0-9 \-;]/g, "");
  };

  const areTeamsFilled = teams.teamA.trim() !== "" && teams.teamB.trim() !== "";
  const isTossHappen = tossWin.trim() !== "";
  const areOversFilled = overs.teamA !== 0 && overs.teamB !== 0;

  return (
    <div className="container grid grid-cols-1 md:grid-cols-5 gap-4 mx-auto pt-4">
      {showPopup && (
        <div className="col-span-1 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold">{winner}</h2>
            <button 
              onClick={() => setShowPopup(false)}
              className="mt-4 px-2 py-2 bg-blue-500 font-extrabold text-center text-gray-800 border-2 border-stone-400 rounded-md">
              Match Finish
            </button>
          </div>
        </div>
      )}    
      {/* First Section */}
      <div className="grid-cols-1 md:col-span-2 bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-2 text-center">LIVE SCORE BOARD</h2>
        <div className="my-2 py-2">
            { areTeamsFilled ? <h2 class="text-2xl font-extrabold text-center text-gray-800 mb-4">{teams.teamA} 🆚 {teams.teamB}</h2> : "" }
            { tossWin != "" ? <h5 className="text-base font-medium text-gray-700 text-center">
              <span class="font-semibold text-blue-600">{tossWin} won the toss and opt to {optTo.toLowerCase()} </span></h5> : "" }
              { winner == "" ? <div class="text-center">
            { battingTeam != "" ? <h2 class="text-lg font-bold text-red-600"> {currentInning === 1 ? "First Inning in Progress" : "Second Inning in Progress"} </h2> : "" }
            </div> : <div class="text-center py-2"><p className="text-violet-500 font-semibold text-lg border-stone-400 border-1 rounded py-2">{winner} Congratulations 🎉</p></div> }
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className={`grid grid-cols-3 gap-4 border-stone-400 border-1 p-2 rounded ${battingTeam == teams.teamA ? "bg-green-300" : "bg-stone-300" }`}>
                    <div className="col-span-1">
                        <h4 className="text-sm md:text-base font-semibold">{teams.teamA}</h4>
                    </div>
                    <div className="col-span-2">
                        <h4 className="text-sm md:text-base font-semibold float-right">{scores.teamA} / {wicket.teamA} ({activeOverUpdate.teamA} Overs)</h4>
                    </div>
                </div>
                <div className={`grid grid-cols-3 gap-4 border-stone-400 border-1 p-2 rounded ${battingTeam == teams.teamB ? "bg-green-300" : "bg-stone-300" }`}>
                    <div className="col-span-1">
                        <h4 className="text-sm md:text-base font-semibold">{teams.teamB}</h4>
                    </div>
                    <div className="col-span-2">
                        <h4 className="text-sm md:text-base font-semibold float-right">{scores.teamB} / {wicket.teamB}  ({activeOverUpdate.teamB} Overs)</h4>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50">
            <h3 className="text-sm md:text-base font-semibold">{teams.teamA} Players</h3>
          </div>
          <div className="border-1 border-sky-500/50 p-2 rounded-tl rounded-tr bg-sky-500/50">
            <h3 className="text-sm md:text-base font-semibold">{teams.teamB} Players</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Team A */}
          <div className="border-1 border-sky-500/50 px-2">
            <ul className="mt-4">
              {players.teamA.map((player, index) => (
                <li key={index} className="py-1">
                  {player.name || `Player ${index + 1}`} - {player.runs} Runs
                </li>
              ))}
            </ul>
          </div>

          {/* Team B */}
          <div className="border-1 border-sky-500/50 px-2">
            <ul className="mt-4">
              {players.teamB.map((player, index) => (
                <li key={index} className="py-1">
                  {player.name || `Player ${index + 1}`} - {player.runs} Runs
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    
    {/* Second Section */}
    {isAdmin && (
      <div className="grid-cols-1 md:col-span-3 bg-white p-4 rounded shadow-md">
        <h3 className="text-xl font-bold mb-2">Team Names</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Team A Name"
            value={teams.teamA}
            onChange={(e) => {
              const teamAName = cleanInput(e.target.value);
              handleTeamChange("teamA", teamAName);
              const updatedTeams = { ...teams, teamA: teamAName };
              setTeams(updatedTeams);

              debouncedUpdate({
                teams: updatedTeams,
                overs,
                tossWin,
                optTo,
                scores,
                wicket,
                updatedAt: new Date(),
              });
            }}
            className="border p-2 w-1/2"
          />
          <input
            type="text"
            placeholder="Team B Name"
            value={teams.teamB}
            onChange={(e) => { 
              const teamBName = cleanInput(e.target.value);
              handleTeamChange("teamB", teamBName);
              const updatedTeams = { ...teams, teamB: teamBName };
              setTeams(updatedTeams);

              debouncedUpdate({
                teams: updatedTeams,
                overs,
                tossWin,
                optTo,
                scores,
                wicket,
                updatedAt: new Date(),
              });
            }}
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
                disabled={!areTeamsFilled}
                value={overs}
                onChange={(e) => handleOverChange(e.target.value)}
                className="border p-2 w-full"
                />
            </div>
            {/* <div className="w-full md:w-auto md:mr-8">
                <h2 className="text-xl font-bold mt-6">Overs</h2>
                <input
                type="number"
                placeholder="Total Overs"
                value={overs.teamA}
                onChange={(e) => { 
                  handleOverChange(e.target.value);
                  const updatedOvers = { ...overs, teamA: parseInt(e.target.value) || 0 };
                  setOvers(updatedOvers);

                  debouncedUpdate({
                    teams,
                    overs: updatedOvers,
                    tossWin,
                    optTo,
                    scores,
                    wicket,
                    updatedAt: new Date(),
                  });
                }}
                className="border p-2 w-full"
                />
            </div> */}

            {/* Toss Time */}
            { areTeamsFilled ? 
            <div className="w-full md:w-auto md:mr-8">
                <h2 className="text-l font-bold mt-8 mb-2">Toss Win By</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="pr-2 block md:inline-block">
                    <input
                        className="mr-2"
                        type="radio"
                        name="toss"
                        value={teams.teamA}
                        checked={tossWin === teams.teamA}
                        onChange={(e) => {
                          const selectedTeam = e.target.value;
                          setTossWin(selectedTeam);
                  
                          debouncedUpdate({
                            teams,
                            overs,
                            tossWin: selectedTeam,
                            optTo,
                            scores,
                            wicket,
                            updatedAt: new Date(),
                          });
                        }}
                    />
                    {teams.teamA}
                    </label>
                  </div>
                  <div>  
                    <label className="pl-2 block md:inline-block">
                    <input
                        className="mr-2"
                        type="radio"
                        name="toss"
                        value={teams.teamB}
                        checked={tossWin === teams.teamB}
                        onChange={(e) => {
                          const selectedTeam = e.target.value;
                          setTossWin(selectedTeam);
                  
                          debouncedUpdate({
                            teams,
                            overs,
                            tossWin: selectedTeam,
                            optTo,
                            scores,
                            wicket,
                            updatedAt: new Date(),
                          });
                        }}
                    />
                    {teams.teamB}
                    </label>
                  </div>
                </div>
            </div>
            : <div className="w-full md:w-auto md:mr-8">
                <p className="text-l font-bold mt-15 mb-2">Toss Winner Update...</p>
              </div> 
            }

            {/* Winning team Opt to */}
            { isTossHappen ?
            <div className="w-full md:w-auto md:ml-8">
                <h2 className="text-l font-bold mt-8 mb-2">and opt to</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="pr-2 block md:inline-block">
                    <input
                        className="mr-2"
                        type="radio"
                        name="opt_to"
                        value="Bat First"
                        checked={optTo === "Bat First"}
                        // onChange={(e) => setOptTo(e.target.value)}
                        onChange={(e) => {
                          const selectedOptTo = e.target.value;
                          setOptTo(selectedOptTo);
                  
                          debouncedUpdate({
                            teams,
                            overs,
                            tossWin,
                            optTo:selectedOptTo,
                            scores,
                            wicket,
                            updatedAt: new Date(),
                          });
                        }}
                    />
                    Bat First
                    </label>
                  </div> 
                  <div>
                    <label className="pl-2 block md:inline-block">
                    <input
                        className="mr-2"
                        type="radio"
                        name="opt_to"
                        value="Bowled First"
                        checked={optTo === "Bowled First"}
                        // onChange={(e) => setOptTo(e.target.value)}
                        onChange={(e) => {
                          const selectedOptTo = e.target.value;
                          setOptTo(selectedOptTo);
                  
                          debouncedUpdate({
                            teams,
                            overs,
                            tossWin,
                            optTo:selectedOptTo,
                            scores,
                            wicket,
                            updatedAt: new Date(),
                          });
                        }}
                    />
                    Bowled First
                    </label>
                  </div>
                </div>  
            </div>
            : <div className="w-full md:w-auto md:mr-8">
                <p className="text-l font-bold mt-5 md:mt-15 mb-2 md:ml-5">Toss Winner Choose To...</p>
              </div> 
            }
        </div>


        {/* Over Breakdown */}
        { areOversFilled ?
        <>
          <h2 className="text-xl font-bold mt-6">Over Breakdown</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
        {Object.keys(overDetails).map((team) => (
          <div key={team} className="mt-4">
            <h3 className="text-lg font-semibold">{teams[team]}</h3>
            {overDetails[team].map((over, overIndex) => (
              <div key={overIndex} className="mt-2">
                <h4 className="font-semibold">Over {overIndex + 1}</h4>
                {/* {console.log(`Team: ${team}, Over Index: ${overIndex}, Active Over: ${activeOver[team]}`)} */}
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                      className={`border p-1 w-auto text-center ${ball.toLowerCase() !== "" && ball.toLowerCase() == "w" ? "wicketColor" : ""} ${ball.toLowerCase() !== "" && ball.toLowerCase() == "no ball" ? "noBallColor" : ""} ${ball.toLowerCase() !== "" && ball.toLowerCase() == "wide ball" ? "wideBallColor" : ""} ${
                        overIndex > activeOver[team] || battingTeam !== teams[team]
                          ? "bg-gray-300 cursor-not-allowed" 
                          : ""
                      }`}
                      disabled={ overIndex > activeOver[team] || battingTeam !== teams[team] }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
          </div>
        </> : ""}

        {/* Update Scores Manually */}
        <h2 className="text-xl font-bold mt-6">Players Name & Score</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {Object.keys(players).map((team) => (
            <div key={team}>
              <h3 className="text-lg font-semibold">Team {teams[team]}</h3>
              {/* {console.log(teams[team]+"//"+tossWin+"//"+optTo)} */}
              {players[team].map((player, index) => (
                <div key={index} className="flex items-center space-x-2 py-1">
                  <input
                    type="text"
                    placeholder={`Player ${index + 1} Name`}
                    value={players[team][index].name}
                    onChange={(e) => handleScoreUpdate(team, index, "name", e.target.value)}
                    className={`border p-1 w-1/2 ${
                      battingTeam !== teams[team] ? "bg-gray-300 cursor-not-allowed" : ""
                    }`}
                    disabled={battingTeam !== teams[team]}
                  />
                  <input
                    type="number"
                    placeholder="Runs"
                    value={players[team][index].runs}
                    onChange={(e) => handleScoreUpdate(team, index, "runs", e.target.value)}
                    className={`border p-1 w-1/2 ${
                      battingTeam !== teams[team] ? "bg-gray-300 cursor-not-allowed" : ""
                    }`}
                    disabled={battingTeam !== teams[team]}
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