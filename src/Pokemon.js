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
            isLoading: true,
            enemyHp: 0,
            playerHp: 0,
            playerTurn: true,
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
                        isLoading: false,
                        playerHp: data.pokemon[index].hp
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
        Modal.setAppElement('#root')
    }

    training = () => {
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
                    "hp": result.data.order,
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
                    enemyHp: result.data.order,
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
                        "hp": result.data.order,
                        "level": this.state.level,
                        "xp": this.state.xp,
                        "moves": [
                            result.data.moves[rand[0]].move.name,
                            result.data.moves[rand[1]].move.name,
                            result.data.moves[rand[2]].move.name,
                            result.data.moves[rand[3]].move.name,
                        ],
                    }),
                    playerHp: result.data.order,
                    isLoading: false
                }, () => {
                    this.savePokemon()
                })
            })
            .catch(err => {
                console.error(err);
            })
    }

    attack = index => {
        if(this.state.playerTurn){
            axios.get(`https://pokeapi.co/api/v2/move/${this.state.pokemon[this.state.selected].moves[index]}`)
                .then(result => {
                    return result.data
                })
                .then(result => {
                    let hit = Math.floor(Math.random() * 100)
                    if(hit < result.accuracy){
                        let aux = this.state.enemy
                        aux.hp = this.state.enemy.hp - (result.pp)
                        this.setState({
                            enemy: aux,
                        })
                    }else{
                        console.log('ERRRRROU')
                    }
                    if(this.state.enemy.hp <= 0){
                        //aumentar HP do player
                        //aumentar XP do player
                        this.battle()
                    }else{
                        this.setState({
                            playerTurn: false,
                        })
                        this.enemyAttack()
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }

    enemyAttack = () => {
        let hit = Math.floor(Math.random() * 4)
        axios.get(`https://pokeapi.co/api/v2/move/${this.state.enemy.moves[hit]}`)
             .then(result => {
                return result.data
             })
             .then(result => {
                let hit = Math.floor(Math.random() * 100)
                if(hit < result.accuracy){
                    let aux2 = this.state.pokemon
                    aux2[this.state.selected].hp = this.state.pokemon[this.state.selected].hp - (result.pp)
                    this.setState({
                        pokemon: aux2,
                    })
                }else{
                    console.log('ERRRRROU')
                }
                this.setState({
                    playerTurn: true,
                })
             })
             .catch(err => {
                 console.error(err)
             })
    }

    render() {
        if (!this.state.isLoading) {
            let user = this.state.pokemon[this.state.selected]
            return (
                <div className="App">
                    <p>{user.nome}</p>
                    <img src={user.front} alt={user.nome} />
                    <p>{this.state.level}</p>
                    <p>{this.state.xp.toFixed(2)}</p><br /><br /><br /><br />
                    <button className="nes-btn" onClick={() => this.training()}>Treinar</button>
                    <button className="nes-btn" onClick={() => this.battle()}>Battle</button>
                    <Modal isOpen={this.state.showModal} className="nes-container is-rounded modal" contentLabel="Example Modal">
                        <h3>Battle</h3>
                        <p>{this.state.enemy.nome}</p>
                        <img src={this.state.enemy.front} alt={this.state.enemy.nome} />
                        <p>{this.state.enemy.hp}/{this.state.enemyHp}</p>
                        <progress className="nes-progress" value={this.state.enemy.hp} max={this.state.enemyHp}></progress>
                        <p>{this.state.enemy.level}</p>
                        <br /><br />

                        <p>{user.nome}</p>
                        <img src={user.front} alt={user.nome} />
                        <p>{user.hp}/{this.state.playerHp}</p>
                        <progress className="nes-progress" value={user.hp} max={this.state.playerHp}></progress>
                        <ul className="attackList">
                            {
                                user.moves.map((move, i) => (
                                    <li key={i} onClick={() => this.attack(i)}>{move}</li>
                                ))
                            }
                            <li>catch</li>
                            <li>run</li>
                        </ul><br />
                        <br />
                        <button className="nes-btn" onClick={() => this.setState({showModal: false})}>Close</button>
                    </Modal>
                </div>
            );
        } else {
            return <p>Carregando</p>
        }
    }
}

export default Pokemon;
