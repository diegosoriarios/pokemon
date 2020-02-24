import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Pokemon from './Pokemon';
import string from './string';

function App() { 
  const [logged, setLogged] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [signUp, setSignUp] = useState(false)
  const [id, setId] = useState(1)

  const checkLogin = () => {
    axios.get(`${string.URL}/users`)
      .then(response => {
        response.data.forEach(value => {
          if(value.username === username && value.password === password){
            setLogged(true)
            setId(value.id)
          }
        })
      })
      .catch(err => console.error(err))
  }

  const createAccount = () => {
    axios.post(`${string.URL}/users`, {
      "username": username,
      "passowrd": username
      })
      .then(response => console.log(response))
      .catch(err => console.error(err))
  }

  const checkPassword = () => (password.length >= 6 && password === confirm)

  if(logged){
    return <Pokemon id={id} password={password} username={username} />
  }else{
    if(signUp){
      return (
        <div className="App">
          <input 
            className="nes-input" 
            type="text" 
            placeholder="username" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
          /><br />
          <input 
            className="nes-input" 
            type="password" 
            placeholder="password" 
            value={password} 
                onChange={e => setPassword(e.target.value)} 
          /><br />
          <input 
          type="password" 
            placeholder="confirm" 
            value={confirm} 
            onChange={e => setConfirm(e.target.value)} 
          /><br />
          <button className="nes-btn" onClick={() => createAccount()} disabled={checkPassword()}>Create Account</button><br />
        <button className="nes-btn" onClick={() => setSignUp(false)}>Voltar</button><br />
        </div>
      );
    }else{
      return(
        <div className="App">
          <input 
            className="nes-input" 
            type="text" 
            placeholder="username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          /><br />
          <input 
            className="nes-input" 
            type="password" 
                placeholder="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          /><br />
          <button className="nes-btn" onClick={() => checkLogin()}>Login</button><br />
          <p onClick={() => setSignUp(true)}>Create Account</p><br />
        </div>
      );
    }
  }
}

export default App;
