import React from 'react';
import firebase from "firebase/app";

class NameManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManagerOpen: false,
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    firebase.database().ref('users_public/' + firebase.auth().currentUser.uid).update({
      name: event.target.fullName.value,
    });
  }

  render() {
    if (!this.state.isManagerOpen) {
      return (
        <div>
          <button onClick={() => this.setState(prevState => ({ isManagerOpen: !prevState.isManagerOpen }))}>Mudar Nome</button>
        </div>
      );
    }

    return (
      <div>
        <button onClick={() => this.setState(prevState => ({ isManagerOpen: !prevState.isManagerOpen }))}>Mudar Nome</button>
        <form onSubmit={this.handleSubmit}>
          <label>Nome Completo:</label>
          <div id="gerenciador">
            <input type="text" name="fullName"></input>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>)

  }
}

export default NameManager;