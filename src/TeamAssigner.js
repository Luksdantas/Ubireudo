import React from 'react';
import firebase from "firebase/app";

class TeamAssigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManagerOpen: false,
      // array que armazena as turmas em que o aluno está participando.
      teamList: [],
    }
  }

  componentDidMount() {
    firebase.database().ref("users_private/" + firebase.auth().currentUser.uid + "/ids_rooms_as_participant")
    .on('value', snapshot => {
      var userTeams = Object.keys(snapshot.val());
      for(var i = 0; i < userTeams.length; i++)
      {
        firebase.database().ref("rooms/" + userTeams[i])
        .on('value', snapshot => {
          if(snapshot.exists())
          {
            this.state.teamList.push(snapshot.val());
          }
        });
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    var key_room = event.target.teamCode.value;
    var roomRef = firebase.database().ref('rooms_enabled/' + key_room);
    roomRef.once('value', function (snapshot) {
      if (snapshot.exists()) {
        if(snapshot.val())
        {
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
        else
        {
          alert("O registro para essa sala foi desativado.");
        }
      }
      else {
        alert("Código de turma inválido. Verifique se o código foi digitado corretamente.");
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

export default TeamAssigner;