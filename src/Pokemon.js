import React, { Component } from 'react';
import axios from 'axios';
import string from './string';
import './App.css';
import Modal from 'react-modal'

class Pokemon extends Component {
    constructor() {
        super();
        this.state = {
            pokemon: [],
            selected: 0,
            level: 1,
            logged: false,
            xp: 0,
            tipo: '',
            enemy: [],
            showModal: false,
            isLoading: true
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
                        xp: data.pokemon[index].xp,
                        tipo: data.pokemon[index].tipo,
                        isLoading: false
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
        Modal.setAppElement('#root')
    }

    training = () => {
        console.log('XP' + this.state.xp)
        console.log('Level ' + this.state.level)
        if (this.state.xp >= Math.floor((Math.pow(2.5, this.state.level)))) {
            this.setState({
                xp: this.state.xp - Math.floor((Math.pow(2.5, this.state.level))),
                level: this.state.level + 1,
            })
        } else {
            if(this.state.xp === 0){
                this.setState({
                    xp: this.state.xp + 1,
                })
            }else{
                this.setState({
                    xp: (this.state.xp + (this.state.level * 0.5))
                })
            }
        }
    }

    battle = () => {
        axios.get('https://pokeapi.co/api/v2/generation/1/')
            .then(result => {
                let rand = Math.floor(Math.random() * result.data.pokemon_species.length)
                this.getEnemy(result.data.pokemon_species[rand].url)
            })
            .catch(err => {
                console.error(err);
            })
    }

    getEnemy = (url) => {
        url = url.replace("-species/", "/");
        axios.get(url)
            .then(result => {
                let rand = [
                    Math.floor(Math.random() * result.data.moves.length),
                    Math.floor(Math.random() * result.data.moves.length),
                    Math.floor(Math.random() * result.data.moves.length),
                    Math.floor(Math.random() * result.data.moves.length)
                ]
                let enemy = {
                    "nome": result.data.name,
                    "front": result.data.sprites.front_default,
                    "tipo": result.data.types[0].type.name,
                    "moves": [
                        result.data.moves[rand[0]].move.name,
                        result.data.moves[rand[1]].move.name,
                        result.data.moves[rand[2]].move.name,
                        result.data.moves[rand[3]].move.name,
                    ]
                }
                this.setState({
                    enemy,
                    showModal: true
                })
            })
            .catch(err => {
                console.error(err);
            })
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
            "tipo": this.state.tipo,
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
                let rand = [
                    Math.floor(Math.random() * result.data.moves.length),
                    Math.floor(Math.random() * result.data.moves.length),
                    Math.floor(Math.random() * result.data.moves.length),
                    Math.floor(Math.random() * result.data.moves.length)
                ]
                this.setState({
                    pokemon: this.state.pokemon.concat({
                        "id": result.data.id,
                        "nome": result.data.name,
                        "front": result.data.sprites.front_default,
                        "tipo": result.data.types[0].type.name,
                        "level": this.state.level,
                        "xp": this.state.xp,
                        "moves": [
                            result.data.moves[rand[0]].move.name,
                            result.data.moves[rand[1]].move.name,
                            result.data.moves[rand[2]].move.name,
                            result.data.moves[rand[3]].move.name,
                        ],
                    }),
                    isLoading: false
                }, () => {
                    this.savePokemon()
                })
            })
            .catch(err => {
                console.error(err);
            })
    }

    render() {
        console.log(this.state.isLoading)
        console.log(this.state.xp)
        if (!this.state.isLoading) {
            return (
                <div className="App">
                    <p>{this.state.pokemon[this.state.selected].nome}</p>
                    {/* <img src={this.state.pokemon[this.state.selected].front} alt={this.state.pokemon[this.state.selected].nome} /> */}
                    <p>{this.state.level}</p>
                    <p>{this.state.xp.toFixed(2)}</p>
                    <ul>
                        <li>{this.state.pokemon[this.state.selected].moves[0]}</li>
                        <li>{this.state.pokemon[this.state.selected].moves[1]}</li>
                        <li>{this.state.pokemon[this.state.selected].moves[2]}</li>
                        <li>{this.state.pokemon[this.state.selected].moves[3]}</li>
                    </ul><br /><br /><br /><br />
                    <button onClick={() => this.training()}>Treinar</button>
                    <button onClick={() => this.battle()}>Battle</button>
                    <Modal isOpen={this.state.showModal} className="modal" contentLabel="Example Modal">
                        <h3>Battle</h3>
                        <p>{this.state.enemy.nome}</p>
                        <img src={this.state.enemy.front} alt={this.state.enemy.nome} />
                        <p>HP</p>
                        <p>{this.state.enemy.level}</p>
                        <br /><br /><br /><br />
                        <p>{this.state.pokemon[this.state.selected].nome}</p>
                        {/* <img src={this.state.pokemon[this.state.selected].front} alt={this.state.pokemon[this.state.selected].nome} /> */}
                        <p>HP</p>
                        <ul>
                            <li>{this.state.pokemon[this.state.selected].moves[0]}</li>
                            <li>{this.state.pokemon[this.state.selected].moves[1]}</li>
                            <li>{this.state.pokemon[this.state.selected].moves[2]}</li>
                            <li>{this.state.pokemon[this.state.selected].moves[3]}</li>
                        </ul><br /><br /><br /><br />
                        <button onClick={() => this.setState({showModal: false})}>Close</button>
                    </Modal>
                </div>
            );
        } else {
            return <p>Carregando</p>
        }
    }
}

export default Pokemon;
