import React from 'react'

import './css/Turmas.css'


function Turmas({ turma }) {
    return (
        <li className="turmas">
            <header>
                <img src="turmaimage" alt="alt" />
                <div className="turma-info">
                    <strong>turma name</strong>
                    <span>turma descrição</span>
                </div>
            </header>
            <p>pontuação</p>
            <a href="">visualizar informações da turma</a>
        </li>
    )
}

export default Turmas