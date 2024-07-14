import { useEffect, useState } from "react";
const KEY = "4f29fb7c";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    callback?.();
    const controller = new AbortController(); //controlling too many request api

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        //--handling error
        if (!response.ok)
          throw new Error("Something went wrong while fetching movies");
        //--handling error
        const data = await response.json();
        //--handling error
        if (data.Response === "False") throw new Error("Movie not found");
        //--handling error
        setMovies(data.Search);
        setError("");
      } catch (err) {
        console.log(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      //cleanup function
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
