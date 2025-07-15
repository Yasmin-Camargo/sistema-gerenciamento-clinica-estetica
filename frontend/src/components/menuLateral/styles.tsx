import styled from 'styled-components';

export const SidebarContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ open }) => (open ? '220px' : '60px')};
  background-color: #F4EDE9;
  color: #151413;
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .toggle {
    background: none;
    border: none;
    color:#a75d16;
    font-size: 2rem;
    padding: 0.5rem;
    cursor: pointer;
    align-self: flex-end;
  }

  .menuItem {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    cursor: pointer;

    &:hover {
      background-color: #a75d16;
    }
  }

  .icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  .menuLabel {
    margin-left: 1rem;
    display: ${({ open }) => (open ? 'inline' : 'none')};
    white-space: nowrap;
  }
`;
