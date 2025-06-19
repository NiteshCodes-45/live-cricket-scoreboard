function PlayerPerformance({players, teams, handleScoreUpdate }){
    return(
        <div className="mt-4 flex flex-col gap-4">
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
                        className={`border p-1 w-1/2`}
                        //${ battingTeam !== teams[team] ? "bg-gray-300 cursor-not-allowed" : "" }
                        //disabled={battingTeam !== teams[team]}
                    />
                    <input
                        type="number"
                        placeholder="Runs"
                        value={players[team][index].runs}
                        onChange={(e) => handleScoreUpdate(team, index, "runs", e.target.value)}
                        className={`border p-1 w-16`}
                        alt="Runs Scored"
                        title="Runs Scored"
                        //${ battingTeam !== teams[team] ? "bg-gray-300 cursor-not-allowed" : "" }
                        //disabled={battingTeam !== teams[team]}
                    />
                    <input
                        type="number"
                        placeholder="Ball Faced"
                        value={players[team][index].ballsFaced}
                        onChange={(e) => handleScoreUpdate(team, index, "ballsFaced", e.target.value)}
                        className={`border p-1 w-16`}
                        alt="Ball Faced"
                        title="Ball Faced"
                        //${ battingTeam !== teams[team] ? "bg-gray-300 cursor-not-allowed" : "" }
                        //disabled={battingTeam !== teams[team]}
                    />
                    <input
                        type="number"
                        placeholder="Fours"
                        value={players[team][index].four}
                        onChange={(e) => handleScoreUpdate(team, index, "four", e.target.value)}
                        className={`border p-1 w-16`}
                        alt="Fours"
                        title="Fours"
                    />
                    <input
                        type="number"
                        placeholder="Sixes"
                        value={players[team][index].six}
                        onChange={(e) => handleScoreUpdate(team, index, "six", e.target.value)}
                        className={`border p-1 w-16`}
                        alt="Six"
                        title="Six"
                    />
                </div>
            ))}
            </div>
        ))}
        </div>    
    )
}

export default PlayerPerformance;