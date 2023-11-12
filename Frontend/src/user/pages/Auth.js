import React ,{ useState,useContext} from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL,VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './Auth.css';

const Auth=()=>{
    const auth=useContext(AuthContext);
    const [isLoginMode,setIsLogInMode]=useState(true);
    
    const {isLoading,error,sendRequest,clearError}=useHttpClient();

    const [formState,inputHandler,setFormData]=useForm({
        email:{
            value:'',
            isValid:false
        },
        password:{
            value:'',
            isValid:false
        }
    },false)

    const switchModeHandler=()=>{
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name:undefined,
                image:undefined
            },formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else{
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:false
                },
                image:{
                    value:null,
                    isValid:false
                }
            },false);
        }
        setIsLogInMode(preMode=>!preMode);
    };

    const authSubmitHandler=async (event)=>{
        event.preventDefault();
        
        if(isLoginMode){
            try{
                const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/login','POST',JSON.stringify({
                    email:formState.inputs.email.value,
                    password:formState.inputs.password.value
                }),
                {
                        'Content-Type':'application/json'
                });
                auth.login(responseData.userId,responseData.token);
            }catch(err){}     
        }
        else{
            try{
                const formData=new FormData();
                formData.append('email',formState.inputs.email.value);
                formData.append('name',formState.inputs.name.value);
                formData.append('password',formState.inputs.password.value);
                formData.append('image',formState.inputs.image.value);

                formData.append('bio',formState.inputs.bio.value);
                formData.append('github',formState.inputs.github.value);
                formData.append('website',formState.inputs.website.value);
                formData.append('seeking',formState.inputs.seeking.value);
                formData.append('techstack',formState.inputs.techstack.value);
                formData.append('fieldofinterest',formState.inputs.fieldofinterest.value);

                const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/signup',
                    'POST',
                    formData
                );
                auth.login(responseData.userId,responseData.token);
            }catch(err){}            
        }   
    }
    
    return (
        <>
        <ErrorModal error={error} onClear={clearError}></ErrorModal>
        <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
            { !isLoginMode && <Input element="input" id="name" type="text" label="Your Name" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a name" onInput={inputHandler}>
            </Input>
            }
            {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image"></ImageUpload>}
                <Input element="input" id="email" type="email" label="E-Mail" validators={[VALIDATOR_EMAIL()]} errorText="Please enter valid email address" onInput={inputHandler}></Input>

                <Input element="input" id="password" type="password" label="Password" validators={[VALIDATOR_MINLENGTH(6)]} errorText="Please enter valid password (atleast having 6 characters)" onInput={inputHandler}></Input>

                {!isLoginMode && <Input element="input" id="bio" type="bio" label="Bio" validators={[VALIDATOR_MINLENGTH(1)]} errorText="Please enter valid bio (atleast having 256 characters)" onInput={inputHandler}></Input>}
                {!isLoginMode && <Input element="input" id="github" type="github" label="Github" validators={[VALIDATOR_MINLENGTH(1)]} errorText="Please enter valid github" onInput={inputHandler}></Input>}
                {!isLoginMode && <Input element="input" id="website" type="website" label="Website" validators={[VALIDATOR_MINLENGTH(1)]} errorText="Please enter valid website" onInput={inputHandler}></Input>}
                {!isLoginMode && <Input element="input" id="seeking" type="seeking" label="Seeking" validators={[VALIDATOR_MINLENGTH(1)]} errorText="Please enter valid seekings" onInput={inputHandler}></Input>}
                {!isLoginMode && <Input element="input" id="techstack" type="techstack" label="Techstack" validators={[VALIDATOR_MINLENGTH(1)]} errorText="Please enter valid Tech stacks" onInput={inputHandler}></Input>}
                {!isLoginMode && <Input element="select" id="fieldofinterest" type="fieldofinterest" label="Field Of Interest" validators={[VALIDATOR_MINLENGTH(1)]} onInput={inputHandler}></Input>}

                <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
                SWITCH TO {isLoginMode? 'SIGNUP' : 'LOGIN'}
            </Button>
        </Card>
        </>
    );
}

export default Auth;