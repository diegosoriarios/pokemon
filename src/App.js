import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Pokemon from './Pokemon';
import string from './string';

class App extends Component {
  constructor(){
    super();
    this.state = {
      logged: false,
      username: '',
      password: '',
      confirm: '',
      signUp: false,
      id: 0,
    }
  }

  checkLogin = () => {
    axios.get(`${string.URL}/users`)
         .then(response => {
           response.data.forEach(value => {
             if(value.username === this.state.username && value.password === this.state.password){
              this.setState({
                logged: true,
                id: value.id
              })
             }
           })
         })
         .catch(err => {
           console.error(err)
         })
  }

  createAccount = () => {
    axios.post(`${string.URL}/users`, {
      "username": this.state.username,
      "passowrd": this.state.username
      }).then(response => {
        console.log(response)
      })
      .catch(err => {
        console.error(err)
      })
  }

  checkPassword = () => {
    if(this.state.password.length >= 6 && this.state.password === this.state.confirm){
      return false;
    }
    return true;
  }

  render(){
    if(this.state.logged){
      return <Pokemon id={this.state.id} password={this.state.password} username={this.state.username} />
    }else{
      if(this.state.signUp){
        return (
          <div className="App">
            <input type="text" placeholder="username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} /><br />
            <input type="password" placeholder="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} /><br />
            <input type="password" placeholder="confirm" value={this.state.confirm} onChange={e => this.setState({confirm: e.target.value})} /><br />
            <button onClick={() => this.createAccount()} disabled={this.checkPassword()}>Create Account</button><br />
            <button onClick={() => this.setState({signUp: false})}>Voltar</button><br />
          </div>
        );
      }else{
        return(
          <div className="App">
            <input type="text" placeholder="username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} /><br />
            <input type="password" placeholder="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} /><br />
            <button onClick={() => this.checkLogin()}>Login</button><br />
            <p onClick={() => this.setState({signUp: true})}>Create Account</p><br />
          </div>
        );
      }
    }
  }
}

export default App;
