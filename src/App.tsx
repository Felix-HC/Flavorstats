import OrpheusFlagLeftSvg from "./assets/svgs/flag-orpheus-left.svg";
import { useState } from 'react'
import { GitBranch } from "lucide-react";

import './App.css'

function App() {
  const [results, setResults] = useState<Array<any> | undefined>(undefined);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showingResults, showResults] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const searchUsers = () => {
    setError(undefined);
    setResults(undefined);
    showResults(true);
    
    fetch(`http://localhost:5000/search?query=${searchInput}`)
      .then(response => response.json())
      .then(data => {
        data.sort((userA: any, userB: any) => userB.cookies - userA.cookies);
        setResults(data);
        
        data.length === 0 && setError("No users found :c");
      })
      .catch(error => {
        console.error(error);
        setError("Couldn't fetch results");
      });
  }

  return (
    <div id="app">
      <img src={OrpheusFlagLeftSvg} id="orpheus-flag" />
      <header>
        <div id="app-title">
          <p id="app-title-surface">Flavorstats</p>
          <div id="app-title-back" />
        </div>
      </header>
      <main>
        <div id="input-wrapper">
          <h2>Search Users</h2>
          <form onSubmit={(e) => { e.preventDefault(); searchUsers() }}>
            <input id="user-input" type="text" placeholder="Search for users..." autoComplete="off" onChange={(e) => setSearchInput(e.target.value)} />
          </form>
        </div>
        {showingResults &&
          <div id="search-results">
            <li>
              {results?.map((user, index) => {
                return (
                  <ul key={index}>
                    <div>
                      <img src={user.avatar} />
                      <span>{user.display_name}</span>
                    </div>
                    <span>🍪 {user.cookies || 0}</span>
                  </ul>
                )
              })}
              {(results === undefined && error === undefined) && <span id="results-loading">Loading...</span>}
              {error !== undefined && <span id="results-not-found">{error}</span>}
            </li>
          </div>
        }
      </main>
      <footer>
        <button onClick={() => window.open("https://github.com/Felix-HC/Flavorstats")}>
            <GitBranch
              size={64}
              strokeWidth={1.5}
            />
        </button>
      </footer>
    </div>
  )
}

export default App
