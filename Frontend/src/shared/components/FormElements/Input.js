import React,{useReducer,useEffect} from 'react';
import { validate } from '../../util/validators';
import './Input.css';

const inputreducer=(state,action)=>{
    switch(action.type){
        case 'CHANGE':
            return {
                ...state,value:action.val,
                isValid:validate(action.val,action.validators)
            };
        case 'TOUCH':{
            return {
                ...state,isTouched:true
            }
        }
        default:
            return state;
    }
};

const Input=props=>{

    //initital state
    const [inputState,dispatch]=useReducer(inputreducer,{value:props.initialValue || '',isValid:props.initialValid || false,isTouched:false});

    const {id,onInput}=props;
    const {value,isValid}=inputState;

    useEffect(()=>{
        onInput(id,value,isValid)
    },[id,value,isValid,onInput]);

    const changeHandler=event=>{
        dispatch({type:'CHANGE',val:event.target.value,validators:props.validators});
    };

    const touchHandler=()=>{
        dispatch({
            type:'TOUCH'
        })
    }
    let element;
    if (props.element==='select'){
        element=<select value={inputState.value} onChange={changeHandler}>
        <option value="Security">Security</option>
        <option value="HR Management">HR Management</option>
        <option value="Technical">Technical</option>
        <option value="Business">Business Executive</option>
        <option value="Customer">Customer support</option>
        <option value="Sales">Sales Executive</option>
    </select>
    }
    else{
        element=props.element==='input'?<input id={props.id} type={props.type} placeholder={props.placeholder} onChange={changeHandler} value={inputState.value} onBlur={touchHandler}></input>:<textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} value={inputState.value} onBlur={touchHandler}></textarea>
    }
    
    return <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
};

export default Input;