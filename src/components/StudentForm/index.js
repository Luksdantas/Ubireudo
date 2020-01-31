import React from 'react'

function StudentForm() {

    return (
        <form>
            <div className="input-block">
                <label htmlFor="nome_aluno">Nome</label>
                <input
                    name="NomeDoAluno"
                    id="nome_aluno"
                    required
                />
            </div>

            <div className="input-block">
                <label htmlFor="url_imagem">Url da Foto</label>
                <input
                    name="UrlDaImagem"
                    id="url_imagem"
                />
            </div>

            <button type="submit">Salvar</button>
        </form>
    )
}

export default StudentForm