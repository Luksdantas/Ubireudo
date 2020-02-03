import React, { useState, useEffect } from 'react';

class TeamManager extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isManagerOpen: false,
      }
    }

    handleSubmit(event) {
      console.log("teste123");
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
            <input type="text"></input>
            <button type="submit">Salvar</button>
          </form>
        </div>)
    
    }
}

  export default TeamManager;