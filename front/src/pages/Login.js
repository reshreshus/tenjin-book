import React, { useState } from 'react'
import { ReactComponent as TenjinIcon } from '../assets/svg/tenjin.svg';
import { CollectionConsumer } from '../context/CollectionContext';

export default function Login() {
  const [isLogin, updateIsLogin] = useState(true);
  const [isPasswordShown, updateIsPasswordShown] = useState(false);
  const [email, updateEmail] = useState();
  const [username, updateUsername] = useState();
  const [password, updatePassword] = useState();

  return (
    <CollectionConsumer>
      {
        ({ loginContext, registerContext }) => {
          const submit = () => {
            if (isLogin) {
              loginContext(email, password);
            } else {
              registerContext(email, username, password);
            }
          }
          return (
            <div className="login">
              {
                isLogin && <form className="login-form">
                <TenjinIcon className="login-form__img"/>
                <div className="field">
                  <input type="email" name="email" className="field__input" placeholder=" "
                  onChange={(e) => {updateEmail(e.target.value)}}/>
                  <label for="email" className="field__label"> Email </label>
                </div>
                <div className="field">
                  <input type={isPasswordShown ? 'text' : 'password'} name="password" className="field__input" placeholder=" "
                  onChange={e => updatePassword(e.target.value)}/>
                  <label for="password" className="field__label"> Password </label>
                  <span className="toggle-password" onClick={() => updateIsPasswordShown(!isPasswordShown)}>
                    { isPasswordShown ? '🙈' : '👁️' }
                  </span>
                </div>

                <div className="btn login-form__btn" onClick={() => submit()}>Sign In</div>
                <div className="btn login-form__option" onClick={() => updateIsLogin(false)}> or <span>Register</span></div>
              </form>
              }
              {
                !isLogin && <form className="login-form">
                <TenjinIcon className="login-form__img"/>
                <div className="field">
                  <input type="username" name="username" className="field__input" placeholder=" "
                  onChange={e => updateUsername(e.target.value)}/>
                  <label for="username" className="field__label"> Username </label>
                </div>
                <div className="field">
                  <input type="email" name="email" className="field__input" placeholder=" "
                  onChange={e => updateEmail(e.target.value)} />
                  <label for="email" className="field__label"> Email </label>
                </div>
                <div className="field">
                  <input type="password" name="password" className="field__input" placeholder=" "
                  onChange={e => updatePassword(e.target.value)} />
                  <label for="password" className="field__label"> Password </label>
                </div>

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
