import React, { useState, useEffect } from 'react';
import { httpGetAsync, httpPutAsync } from './firebase';
import { globalUser} from './SignInScreen.js';

class TeamManager extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isManagerOpen: false,
      }
    }

    handleSubmit(event) {
      event.preventDefault();
      httpGetAsync('https://ubireudo.firebaseio.com/users_public/' + globalUser.uid + 
      '.json?auth=' + globalUser.uid, function(texto) {
        var userData = JSON.parse(texto);
        userData.teamCode = event.target.teamCode.value;
        httpPutAsync('https://ubireudo.firebaseio.com/users_public/' + globalUser.uid + 
        '.json?auth=' + globalUser.uid, JSON.stringify(userData), function(texto) {
        console.log(texto);
      });
      });
    }
  
    render() {
      if(!this.state.isManagerOpen)
      {
        return (
          <div>
            <button onClick={() => this.setState(prevState => ({
            isManagerOpen: !prevState.isManagerOpen}))}>Gerenciador de Turmas</button>
          </div>
          );
      }

      return (
        <div>
          <button onClick={() => this.setState(prevState => ({
            isManagerOpen: !prevState.isManagerOpen}))}>Gerenciador de Turmas</button>
          <form onSubmit={this.handleSubmit}>
            <label>Código da turma:</label>
            <input type="text" name="teamCode"></input>
            <button type="submit">Salvar</button>
          </form>
        </div>)
    
    }
}

  export default TeamManager;