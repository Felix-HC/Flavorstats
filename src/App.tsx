import { useState } from 'react'

import './App.css'

function App() {
  const [results, setResults] = useState<Array<any> | undefined>(undefined);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showingResults, showResults] = useState<boolean>(false);

  const searchUsers = () => {
    console.log(`http://localhost:5000/search?query=${searchInput}`);

    fetch(`http://localhost:5000/search?query=${searchInput}`)
      .then(response => response.json())
      .then(data => setResults(data));

    showResults(true);
  }

  return (
    <div id="app">
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
            <input id="user-input" type="text" placeholder="_" onChange={(e) => setSearchInput(e.target.value)} />
          </form>
        </div>
        {showingResults &&
          <div id="search-results">
            <li>
              {results?.map((user, index) => {
                return (
                  <ul key={index}>
                    <img src={user.avatar} />
                    <span>{user.display_name}</span>
                  </ul>
                )
              })}
            </li>
          </div>
        }
      </main>
    </div>
  )
}

export default App
