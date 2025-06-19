import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SeriesManager = () => {
  const [seriesName, setSeriesName] = useState('');
  const [matchData, setMatchData] = useState({ teamA: '', teamB: '', seriesId: '', seriesName:'', matchStatus:'', matchDateTime: '' });
  const [allSeries, setAllSeries] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 6;

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
    const selectedSeries = allSeries.find((s) => s.id === matchData.seriesId);
    const newMatch = {
      ...matchData,
      seriesName: selectedSeries?.name || '',
      matchStatus: 'Upcoming',
      createdAt: new Date(),
      matchDateTime: matchData.matchDateTime || new Date().toISOString()
    };

    try {
      const matchRef = await addDoc(collection(db, 'matches'), newMatch);
      const seriesRef = doc(db, 'series', newMatch.seriesId);
      await setDoc(seriesRef, {
        matches: { [matchRef.id]: true }
      }, { merge: true });

      setMatchData({
        teamA: '',
        teamB: '',
        seriesId: '',
        seriesName: '',
        matchStatus: 'Upcoming',
        matchDateTime: ''
      });
      fetchMatches();
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const filteredMatches = allMatches.filter(match => {
    const matchSeries = selectedSeriesFilter ? match.seriesId === selectedSeriesFilter : true;
    const matchStatus = selectedStatusFilter === "live"
      ? !match.winner
      : selectedStatusFilter === "complete"
      ? !!match.winner
      : true;
    return matchSeries && matchStatus;
  });

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
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
      <input
        type="datetime-local"
        value={matchData.matchDateTime}
        onChange={(e) => setMatchData({ ...matchData, matchDateTime: e.target.value })}
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white mb-3 sm:mb-0 sm:mr-2 flex-1 w-90 md:w-50"
      />
      <button onClick={handleMatchCreate} className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition">Add Match</button>

      <h2 className="text-xl font-bold mt-6 mb-4">Filter Matches</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={selectedSeriesFilter}
          onChange={(e) => setSelectedSeriesFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        >
          <option value="">All Series</option>
          {allSeries.map((series) => (
            <option key={series.id} value={series.id}>{series.name}</option>
          ))}
        </select>
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        >
          <option value="">All Status</option>
          <option value="live">Live Matches</option>
          <option value="complete">Completed Matches</option>
        </select>
      </div>

      <h2 className="text-xl font-bold mb-2">Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMatches.map(match => (
          <div key={match.id} className="p-4 bg-[#fffbf5] rounded-2xl shadow-lg py-4 px-6 flex-shrink-0 border border-gray-200 hover:shadow-xl transition duration-300">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">{match.seriesName}</p>
            <h3 className="font-bold text-base mb-1 flex items-center gap-2">
              {match.teamA} vs {match.teamB}
              {!match.winner && <span className="text-red-600 text-sm">🔴 Live</span>}
            </h3>
            <p className="text-sm text-gray-700 mb-1">Scheduled: <span className="font-medium">{!match.matchDateTime ? "" : formatDateTime(match.matchDateTime)}</span></p>
            <p className="text-sm text-gray-700 mb-1">Status: <span className="text-orange-500">{match.winner ? 'Complete' : match.matchStatus}</span></p>
            {match.winner && <p className="text-sm text-green-600 mb-1">Winner: <span className="font-medium">{match.winner}</span></p>}
            <Link to={`/live-match-update/${match.id}`} className="text-blue-600 underline mt-2 inline-block">Go to Match</Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-600'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeriesManager;
