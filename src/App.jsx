import React from 'react'
import { db } from '../backend/firebase/firebaseConfig'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Welcome to Latimer Lab</h1>
      </header>
      <main>
        <p>Your website is now live!</p>
      </main>
    </div>
  )
}

export default App 