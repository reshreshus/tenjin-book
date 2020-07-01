import React, { useState, useEffect } from 'react'
import { ReactComponent as TenjinIcon } from '../assets/svg/tenjin.svg';
import { CollectionConsumer } from '../context/CollectionContext';

export default function Login() {
  const [isLogin, updateIsLogin] = useState(true);
  const [isPasswordShown, updateIsPasswordShown] = useState(false);
  const [email, updateEmail] = useState();
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');
  const [ errors, updateErrors ] = useState('');
  useEffect(() => {
    updateErrors(null);
  }, [ isLogin ])
  function Errors() {
    return (
      <div className="login-form__errors">
      {
        errors && errors.map(e => e)
      } </div>
    )
  }

  return (
    <CollectionConsumer>
      {
        ({ loginContext, registerContext }) => {
          const submit = async () => {
            // updateErrors([]);
            let result;
            const errors = [];
            const validations = [(email.length >= 6), (username.length >=2), (password.length >=1)]
            if (!validations[0]) errors.push('email must contain at least 6 characters')
            if (!isLogin && !validations[1]) result.push('username must contain at least 2 characters')
            if (!validations[2]) errors.push('password must contain at least 1 character')
            if (errors.length === 0) {
              if (isLogin) {
                result = await loginContext(email, password);
              } else {
                result = await registerContext(email, username, password);
              }
              if (result.errors && result.errors.length > 0) {
                updateErrors(result.errors)
                return;
              }
            } else {
              updateErrors(errors);
              return;
            }
            updateIsLogin(true);
          }

          const handleKeyPress = (event) => {
            if(event.key === 'Enter'){
              submit();
            }
          }
          return (
            <div className="login">
              {
                isLogin && <form className="login-form">
                <TenjinIcon className="login-form__img"/>
                <div className="field">
                  <input type="email" name="email" className="field__input" placeholder=" "
                  onChange={(e) => { updateEmail(e.target.value) }} onKeyPress={handleKeyPress} />
                  <label for="email" className="field__label"> Email </label>
                </div>
                <div className="field">
                  <input type={isPasswordShown ? 'text' : 'password'} name="password" className="field__input" placeholder=" "
                  onChange={e => updatePassword(e.target.value)} onKeyPress={handleKeyPress} />
                  <label for="password" className="field__label"> Password </label>
                  <span className="toggle-password" onClick={() => updateIsPasswordShown(!isPasswordShown)}>
                    { isPasswordShown ? '🙈' : '👁️' }
                  </span>
                </div>

                <Errors />
                <div className="btn login-form__btn" onClick={() => submit()}>Sign In</div>
                <div className="btn login-form__option" onClick={() => updateIsLogin(false)}> or <span>Register</span></div>
              </form>
              }
              {
                !isLogin && <form className="login-form">
                <TenjinIcon className="login-form__img"/>
                <div className="field">
                  <input type="username" name="username" className="field__input" placeholder=" "
                  onChange={e => updateUsername(e.target.value)} onKeyPress={handleKeyPress} />
                  <label for="username" className="field__label"> Username </label>
                </div>
                <div className="field">
                  <input type="email" name="email" className="field__input" placeholder=" "
                  onChange={e => updateEmail(e.target.value)} onKeyPress={handleKeyPress} />
                  <label for="email" className="field__label"> Email </label>
                </div>
                <div className="field">
                  <input type="password" name="password" className="field__input" placeholder=" "
                  onChange={e => updatePassword(e.target.value)}  onKeyPress={handleKeyPress} />
                  <label for="password" className="field__label"> Password </label>
                </div>

                <Errors />
                <div className="btn login-form__btn" onClick={() => submit()}>Register</div>
                <div className="btn login-form__option" onClick={() => updateIsLogin(true)}> or <span>Sign In</span></div>
              </form>
              }
            </div>
          )
        }
      }
    </CollectionConsumer>
  )
}