import React from 'react'
import firebase from "firebase/app";

import './css/Teams.css'

class Teams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          // array que armazena as turmas em que o aluno está participando.
          teams: {},
        }
    }

    componentDidMount() {
      firebase.database().ref("users_private/" + firebase.auth().currentUser.uid + "/ids_rooms_as_participant")
      .on('value', snapshot => {
        var teamsNames = Object.keys(snapshot.val());
        for(var i = 0; i < teamsNames.length; i++)
        {
          firebase.database().ref("rooms_public/" + teamsNames[i])
          .on('value', snapshot => {
            if(snapshot.exists())
            {
              var teams = this.state.teams;
              teams[snapshot.key] = snapshot.toJSON();
              this.setState({teams: teams});
            }
          });
        }
      });
    }
    
    render() {
      return (
        <div>{
          Object.keys(this.state.teams).map(key => (
            <li key={key} className="turmas">
            <header>
              <img src={this.state.teams[key].urlImage} alt="alt" />
              <div className="turma-info">
                <strong>{this.state.teams[key].name}</strong>
                <span>{this.state.teams[key].description}</span>
              </div>
            </header>
            <p>pontuação</p>
            </li>
          ))};</div>
      );
    }
  }

export default Teams