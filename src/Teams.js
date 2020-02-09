import React from 'react'

import './css/Teams.css'

class Teams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          teams: null,
        }
    }

    render() {
        const teamBlock = (
        <li className="turmas">
            <header>
                <img src="turmaimage" alt="alt" />
                <div className="turma-info">
                    <strong>turma name</strong>
                    <span>turma descrição</span>
                </div>
            </header>
            <p>pontuação</p>
        </li>);
      return (
        teamBlock
      );
    }
  }

export default Teams