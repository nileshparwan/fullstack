import React, { useReducer } from 'react';
import { validate } from '../../util/validator';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      };
    }
    default:
      return state;
  }
};


const Element = (props) => props.element === "input" ? (
  <input
    className={props.className}
    id={props.id}
    type={props.type}
    value={props.value}
    placeholder={props.placeholder}
    onChange={props.onChange}
    onBlur={props.onBlur}
  />
) : (
  <textarea
    id={props.id}
    rows={props.rows || 3}
    value={props.value}
    onChange={props.onChange}
    onBlur={props.onBlur}
  />
);

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  React.useEffect(() => {
    if (onInput) {
      onInput(id, value, isValid);
    }
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  return (
    <div className={`form-control ${!inputState.isValid && !inputState.isTouch && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <Element {...props} value={inputState.value} onChange={changeHandler} onBlur={touchHandler} />
      {!inputState.isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;