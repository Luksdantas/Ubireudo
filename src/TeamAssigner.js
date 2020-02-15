import React from 'react';
import firebase from "firebase/app";

class TeamAssigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManagerOpen: false,
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    var key_room = event.target.teamCode.value;
    var roomRef = firebase.database().ref('rooms_public/' + key_room);
    roomRef.once('value', function (roomSnapshot) {
      firebase.database().ref("users_private/" + firebase.auth().currentUser.uid + "/ids_rooms_as_participant")
      .once('value', participantSnapshot => {
        // Caso o código informado pelo usuário não corresponda a nenhuma turma disponível
        // no banco de dados, o registro do usuário na sala não será efetuado.
        if (!roomSnapshot.exists()) {
          alert("Código de turma inválido. Verifique se o código foi digitado corretamente.");
          return;
        }
        // Caso o usuário já esteja participando da sala cujo código foi fornecido,
        // o registro do usuário na sala não será efetuado novamente.
        if(participantSnapshot.hasChild(key_room))
        {
          alert("Você já está registrado nessa sala.");
          return;
        }
        // Caso a sala tenha o atributo enabled como falso no banco de dados, 
        // o registro do usuário na sala não será efetuado.
        if(!roomSnapshot.child('enabled').val()) {
          alert("O registro para essa sala foi desativado.");
          return;
        }

        var dateFormat = require('dateformat');
        var now = new Date();
        now = dateFormat(now, "dd-mm-yyyy");

        var uid = firebase.auth().currentUser.uid;

        firebase.database().ref('rooms_private/' + key_room + '/uid_participants/' + uid + "/" + now + "/").update({
          [new Date().getTime()]: 0,
        });

        firebase.database().ref('users_private/' + uid + '/ids_rooms_as_participant/').update({
          [key_room]: true,
        });

        alert("Participante adicionado com sucesso!");
      });
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