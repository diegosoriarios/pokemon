import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      pokemon: [],
      selected: 0
    }
  }
  componentDidMount = () => {
    axios.get('https://pokeapi.co/api/v2/generation/1/')
         .then(result => {
           let rand = Math.floor(Math.random() * result.data.pokemon_species.length)
           this.getData(result.data.pokemon_species[rand].url)
         })
         .catch(err => {
           console.error(err);
         })
  }

  getData = (url) => {
    url = url.replace("-species/", "/");
    axios.get(url)
         .then(result => {
           console.log(result.data)
           let rand = [Math.floor(Math.random() * result.data.moves.length),
                   Math.floor(Math.random() * result.data.moves.length),
                   Math.floor(Math.random() * result.data.moves.length),
                   Math.floor(Math.random() * result.data.moves.length)]
           this.setState({
             pokemon: this.state.pokemon.concat({
              "id": result.data.id,
              "nome": result.data.name,
              "front": result.data.sprites.front_default,
              "moves": [
                result.data.moves[rand[0]].move.name,
                result.data.moves[rand[1]].move.name,
                result.data.moves[rand[2]].move.name,
                result.data.moves[rand[3]].move.name,
              ],
             })
           })
         })
         .catch(err => {
           console.error(err);
         })
  }

  render() {
    console.log(this.state.pokemon)
    if(this.state.pokemon.length > 0){
      return (
        <div className="App">
          <p>{this.state.pokemon[this.state.selected].nome}</p>
          <img src={this.state.pokemon[this.state.selected].front} alt={this.state.pokemon[this.state.selected].nome} />
          <ul>
            <li>{this.state.pokemon[this.state.selected].moves[0]}</li>
            <li>{this.state.pokemon[this.state.selected].moves[1]}</li>
            <li>{this.state.pokemon[this.state.selected].moves[2]}</li>
            <li>{this.state.pokemon[this.state.selected].moves[3]}</li>
          </ul>
        </div>
      );
    }else{
      return <p>Carregando</p>
    }
  }
}

export default App;
