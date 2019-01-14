import React, { Component } from 'react';
import axios from 'axios';
import string from './string';
import './App.css';

class Pokemon extends Component {
    constructor() {
        super();
        this.state = {
            pokemon: [],
            selected: 0,
            level: 1,
            logged: false,
            xp: 0,
        }
    }
    componentDidMount = () => {
        axios.get(`${string.URL}/users/${this.props.id}`)
            .then(result => {
                return result.data
            })
            .then(data => {
                if (data.pokemon.length === 0) {
                    this.getAPokemon()
                } else {
                    let index = data.selected
                    this.setState({
                        pokemon: data.pokemon,
                        selected: data.selected,
                        level: data.pokemon[index].level,
                        xp: data.pokemon[index].xp
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })

    }

    training = () => {
        if (this.state.xp >= (this.state.level * 15)) {
            this.setState({
                xp: this.state.xp - (this.state.level * 15),
                level: this.state.level + 1,
            })
        } else {
            this.setState({
                xp: this.state.xp * 1.05
            })
        }
    }

    getAPokemon = () => {
        axios.get('https://pokeapi.co/api/v2/generation/1/')
            .then(result => {
                let rand = Math.floor(Math.random() * result.data.pokemon_species.length)
                this.getData(result.data.pokemon_species[rand].url)
            })
            .catch(err => {
                console.error(err);
            })
    }

    savePokemon = () => {
        axios.put(`${string.URL}/users/${this.props.id}/`, {
            "username": this.props.username,
            "password": this.props.password,
            "selected": this.state.selected,
            "pokemon": this.state.pokemon
            })
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.error(err)
            })
    }

    getData = (url) => {
        url = url.replace("-species/", "/");
        axios.get(url)
            .then(result => {
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
                }, () => {
                    this.savePokemon()
                })
            })
            .catch(err => {
                console.error(err);
            })
    }

    render() {
        if (this.state.pokemon.length > 0) {
            return (
                <div className="Pokemon">
                    <p>{this.state.pokemon[this.state.selected].nome}</p>
                    {/* <img src={this.state.pokemon[this.state.selected].front} alt={this.state.pokemon[this.state.selected].nome} /> */}
                    <ul>
                        <li>{this.state.pokemon[this.state.selected].moves[0]}</li>
                        <li>{this.state.pokemon[this.state.selected].moves[1]}</li>
                        <li>{this.state.pokemon[this.state.selected].moves[2]}</li>
                        <li>{this.state.pokemon[this.state.selected].moves[3]}</li>
                    </ul>
                </div>
            );
        } else {
            return <p>Carregando</p>
        }
    }
}

export default Pokemon;
