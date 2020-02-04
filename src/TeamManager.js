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
    var dateFormat = require('dateformat');
    var now = new Date();
    now = dateFormat(now, "dd-mm-yyyy"); 

    var uid = firebase.auth().currentUser.uid;
    var key_room = event.target.teamCode.value;

    firebase.database().ref('rooms/'+ key_room + '/uid_partcipants/' + uid + "/" + now + "/").update({
       [new Date().getTime()]: 0,
    });

    firebase.database().ref('users_private/'+ uid + '/ids_rooms_as_participant/').update({
      [key_room]: true,
   });

   alert("Participante adicionado com sucesso!");
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