import React from 'react'
import firebase from "firebase/app";

import './css/TeamsList.css'

class TeamsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          // array que armazena as turmas em que o aluno está participando.
          teams: {},
          scores: {}
        }
    }

    componentDidMount() {
      firebase.database().ref("users_private/" + firebase.auth().currentUser.uid + "/ids_rooms_as_participant")
      .on('value', snapshot => {
        var teamsNames = Object.keys(snapshot.val());
        for(let i = 0; i < teamsNames.length; i++)
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
          firebase.database().ref("rooms_private/" + teamsNames[i] + "/uid_participants/" +
          firebase.auth().currentUser.uid)
          .on('value', userScore => {
            if(userScore.exists())
            {
              var scores = this.state.scores;
              scores[teamsNames[i]] = 0;
              userScore.forEach(function(dayScore) {
                dayScore.forEach(function(momentScore) {
                  scores[teamsNames[i]] += momentScore.val();
                });
              });
              this.setState({scores: scores});
            }
          });
        }
      });
    }
    
    render() {
      return (
          Object.keys(this.state.teams).map(key => (
            <li key={key} className="turmas">
              <header>
                <img src={this.state.teams[key].urlImage} alt="alt" />
                <div className="turma-info">
                  <strong>{this.state.teams[key].name}</strong>
                  <span>{this.state.teams[key].description}</span>
                </div>
              </header>
              <p>Pontuação: {this.state.scores[key]}</p>
              <button className="teamAcess">Acessar turma</button>
            </li>
          ))
      )
    }
  }

export default TeamsList