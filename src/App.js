import React from 'react';

import './App.css';
import './global.css'
import './Main.css'

import StudentForm from './components/StudentForm'
function App() {

  return (

    <div id="app">

      <main>

        <strong>Cadastrar</strong>
        <StudentForm />

      </main>

    </div>

  );
}

export default App;
