// src/hooks/useSeriesAndMatches.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const useSeriesAndMatches = () => {
  const [allSeries, setAllSeries] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeriesAndMatches = async () => {
      try {
        const seriesSnapshot = await getDocs(collection(db, "series"));
        const matchesSnapshot = await getDocs(collection(db, "matches"));

        const seriesList = seriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const matchList = matchesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setAllSeries(seriesList);
        setAllMatches(matchList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching series or matches:", error);
      }
    };

    fetchSeriesAndMatches();
  }, []);

  return { allSeries, allMatches, loading };
};

export default useSeriesAndMatches;
