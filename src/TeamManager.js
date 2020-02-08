import React from 'react';
import firebase from "firebase/app";

class TeamManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManagerOpen: false,
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    var key_room = event.target.teamCode.value;
    var roomRef = firebase.database().ref('rooms/');
    roomRef.once('value', function (snapshot) {
      if (snapshot.hasChild(key_room)) {
        var dateFormat = require('dateformat');
        var now = new Date();
        now = dateFormat(now, "dd-mm-yyyy");

        var uid = firebase.auth().currentUser.uid;

        firebase.database().ref('rooms/' + key_room + '/uid_participants/' + uid + "/" + now + "/").update({
          [new Date().getTime()]: 0,
        });

        firebase.database().ref('users_private/' + uid + '/ids_rooms_as_participant/').update({
          [key_room]: true,
        });

        alert("Participante adicionado com sucesso!");
      }
      else {
        alert("Código de turma inválido. Confira se o código foi digitado corretamente.");
      }
    });
  }

  render() {
    if (!this.state.isManagerOpen) {
      return (
        <div>
          <button onClick={() => this.setState(prevState => ({ isManagerOpen: !prevState.isManagerOpen }))}>Entrar em uma Turma</button>
        </div>
      );
    }

    return (
      <div>
        <button onClick={() => this.setState(prevState => ({ isManagerOpen: !prevState.isManagerOpen }))}>Entrar em uma Turma</button>
        <form onSubmit={this.handleSubmit}>
          <label>Código da turma:</label>
          <div id="gerenciador">
            <input type="text" name="teamCode"></input>
            <button type="submit">Entrar</button>
          </div>
        </form>
      </div>)

  }
}

export default TeamManager;