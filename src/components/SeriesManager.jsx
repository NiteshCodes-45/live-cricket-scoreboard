import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SeriesManager = () => {
  const [seriesName, setSeriesName] = useState('');
  const [matchData, setMatchData] = useState({ teamA: '', teamB: '', seriesId: '', seriesName:'', matchStatus:'' });
  const [allSeries, setAllSeries] = useState([]);
  const [allMatches, setAllMatches] = useState([]);

  useEffect(() => {
    fetchSeries();
    fetchMatches();
  }, []);

  const fetchSeries = async () => {
    const querySnapshot = await getDocs(collection(db, 'series'));
    const seriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllSeries(seriesList);
  };

  const fetchMatches = async () => {
    const querySnapshot = await getDocs(collection(db, 'matches'));
    const matches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllMatches(matches);
  };

  const handleSeriesCreate = async () => {
    if (seriesName.trim()) {
      await addDoc(collection(db, 'series'), { name: seriesName });
      setSeriesName('');
      fetchSeries();
    }
  };

  const handleMatchCreate = async () => {
    // Get the selected series name from allSeries using the ID
    const selectedSeries = allSeries.find((s) => s.id === matchData.seriesId);

    const newMatch = {
      ...matchData,
      seriesName: selectedSeries?.name || '',
      matchStatus: 'Upcoming',
      createdAt: new Date()
    };
  
    try {
        // Add the match to Firestore
        const matchRef = await addDoc(collection(db, 'matches'), newMatch);
  
        // Link match to series
        const seriesRef = doc(db, 'series', newMatch.seriesId);
        await setDoc(seriesRef, {
            matches: { [matchRef.id]: true }
        }, { merge: true });
  
        // Clear the form
        setMatchData({
            teamA: '',
            teamB: '',
            seriesId: '',
            seriesName: '',
            matchStatus: 'Upcoming'
        });
        fetchMatches();
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Create New Series</h2>
      <input
      type="text"
      value={seriesName}
      onChange={(e) => setSeriesName(e.target.value)}
      placeholder="Series Name"
      className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white mb-3 sm:mb-0 sm:mr-2 flex-1 w-90 md:w-50"
    />
    <button
      onClick={handleSeriesCreate}
      className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition"
    >
      Add Series
    </button>

      <h2 className="text-xl font-bold mt-6 mb-2">Add Match to Series</h2>
      <select
        value={matchData.seriesId}
        onChange={(e) => setMatchData({ ...matchData, seriesId: e.target.value })}
        className="border border-gray-300 px-2 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white mb-3 sm:mb-0 sm:mr-2 flex-1 w-90 md:w-50"
      >
        <option value="">Select Series</option>
        {allSeries.map(series => (
          <option key={series.id} value={series.id}>{series.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={matchData.teamA}
        onChange={(e) => setMatchData({ ...matchData, teamA: e.target.value })}
        placeholder="Team A"
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white mb-3 sm:mb-0 sm:mr-2 flex-1 w-90 md:w-50"
      />
      <input
        type="text"
        value={matchData.teamB}
        onChange={(e) => setMatchData({ ...matchData, teamB: e.target.value })}
        placeholder="Team B"
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white mb-3 sm:mb-0 sm:mr-2 flex-1 w-90 md:w-50"
      />
      <button onClick={handleMatchCreate} className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition">Add Match</button>

      <h2 className="text-xl font-bold mt-6 mb-2">Matches by Series</h2>
      {allSeries.map(series => (
        <div key={series.id} className="mb-4">
          <h3 className="font-semibold text-base font-bold pt-2 uppercase">{series.name}</h3>
          <ul className="ml-4 mt-4 list-disc">
            {allMatches
              .filter(match => match.seriesId === series.id)
              .map(match => (
                <li className='p-2' key={match.id}>
                  <span className='font-bold'>{match.teamA} vs {match.teamB}</span> | <span className='text-orange-500'> {match.matchStatus}</span> | 
                  <Link
                    to={`/live-match-update/${match.id}`}
                    className="ml-2 text-blue-600 underline"
                  >
                    Go to Match
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SeriesManager;
