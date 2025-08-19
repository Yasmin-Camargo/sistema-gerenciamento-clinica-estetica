import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  background-color: #F4EDE9;
`;

interface ContentProps {
  $sidebarOpen: boolean;
}

export const Content = styled.div<ContentProps>`
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '220px' : '60px')};
  transition: margin-left 0.3s;
  padding: 0rem 1rem 0rem 1.0rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;

  .content {
    background: #f5f5f5;
    min-height: calc(100vh - 3rem);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border: 1px solid #c87624;

  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 1.8rem;
    color: #333;
  }

  .action-button {
    background-color: #401808;
    color: #fff;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .action-button:hover {
    background-color: #a75d16;
  }

  .filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  textarea {
    width: 100%;
    height: 100px;
    padding: 0.75rem;
    border: 1px solid #c87624;
    border-radius: 8px;
    box-sizing: border-box;
    font-size: 1rem;
    resize: vertical;
  }

.table {
  width: 100%;
  border-collapse: separate; 
  border-spacing: 0;          
  background: #fff;         
  border-radius: 8px;   
  overflow: hidden;           
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05); 
  margin-bottom: 1.5rem;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
  border-right: 1px solid #ddd;
}

.table th:last-child,
.table td:last-child {
  border-right: none; 
}

.table thead th {
  background: #fafafa;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.table tbody tr:hover {
  background: #f1f1f1;
}

.table tbody tr:last-child td {
  border-bottom: none; 
}

  .filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .filtros .react-datepicker-wrapper input{
    min-width: 300px;
  }

.react-datepicker__close-icon::after {
    flex: 1 1 200px;
    background-color: #a75d16;
  }

  .filtros input,
  .filtros select {
    flex: 1 1 200px;
    min-width: 180px;

    padding: 0.75rem;
    border: 1px solid #c87624;
    border-radius: 8px;
    font-size: 1rem;

    background-color: white;
    color: #401808;

    transition: border 0.3s;
  }

  .filtros input:focus,
  .filtros select:focus {
    outline: none;
    border-color: #a75d16;
  }

.form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  width: 100%;
    box-sizing: border-box;
  }

  .form .field {
    display: flex;
    flex-direction: column;
  }

  .form .field label {
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: #333;
  }

  .form .field input,
  .form .field select {
    padding: 0.75rem;
    border: 1px solid #c87624;
    border-radius: 8px;
    font-size: 1rem;
  }

  .form .actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }

  .form .btn-submit {
    background: #c87624;
    color: #fff;
    border: none;
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .form .btn-cancel {
    background: #fff;
    color: #555;
    border: 1px solid #c87624;
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .new-health-record {
  background-color: #401808;
    color: #fff;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .new-health-record:hover {
    background-color: #a75d16;
  }

  .infos {
    display: flex;
    justify-content: flex-start;
    gap: 15px;
    margin-top: 10px;
  }

  .infos p {
  flex: 1;
  background: white;
  border-radius: 10px;
  border: 0.7px solid #a75d16;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #444;
  transition: transform 0.2s ease;
  max-width: 340px;
}
`;
