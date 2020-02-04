import React, { useState, useEffect } from 'react';
import firebase from "firebase";

class TeamManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManagerOpen: false,
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    firebase.database().ref('users_public/' + firebase.auth().currentUser.uid).update({
      teamCode : event.target.teamCode.value,
    });
  }

  render() {
    if (!this.state.isManagerOpen) {
      return (
        <div>
          <button onClick={() => this.setState(prevState => ({
            isManagerOpen: !prevState.isManagerOpen
          }))}>Gerenciador de Turmas</button>
        </div>
      );
    }

    return (
      <div>
        <button onClick={() => this.setState(prevState => ({
          isManagerOpen: !prevState.isManagerOpen
        }))}>Gerenciador de Turmas</button>
        <form onSubmit={this.handleSubmit}>
          <label>Código da turma:</label>
          <div id="entrarturma">

            <input type="text" name="teamCode"></input>
            <button type="submit">Entrar na Turma</button>

          </div>
        </form>
      </div>)

  }
}

export default TeamManager;