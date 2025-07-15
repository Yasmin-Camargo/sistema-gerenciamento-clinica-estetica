import styled from 'styled-components'

export const EstheticianFormContainer = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


  background-color: #c87624;
  font-family: 'Basic', sans-serif;

  /* ---------- card ---------- */
  .container {
    width: 90%;
    max-width: 800px;

    /* faz o card nunca passar da viewport e cria scroll interno */
    max-height: 80vh;
    overflow-y: auto;

    /* layout */
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;   /* << alinha tudo à ESQUERDA */
    gap: 1rem;

    background-color: #fffaf8;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* ---------- agrupador horizontal ---------- */
  .linha {
    width: 100%;
    display: flex;    
    flex-wrap: wrap;           /* quebra em telas estreitas */
  }

  /* ---------- bloco de input ---------- */
  .input {
    width: 100%;
    margin: 0px 0px 14px 0px;
  }

  .input h2 {
    font-size: 16px;
    margin-bottom: 0.4rem;
    color: #333;
  }

  .input input,
  .input textarea {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #c87624;
    border-radius: 4px;
    font-size: 1rem;
    color: #333;
  }

  .container::-webkit-scrollbar {
    width: 6px;
  }
  .container::-webkit-scrollbar-thumb {
    background: #c87624;
    border-radius: 3px;
  }

    .form-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    width: 100%;
  }

  .btn-salvar {
    background-color: #a75d16;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn-salvar:hover {
    background-color: #492503ff;
  }

  .btn-cancelar {
    background-color: white;
    color: #555;
    border: 2px solid #c87624;
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-cancelar:hover {
    background-color: #f3f3f3;
  }

`;
