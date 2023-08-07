import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.css';

function SideDrawer(props) {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <div className='side-drawer' onClick={props.onClick}>{props.children}</div>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("backdrop-hook"));
}

export default SideDrawer;