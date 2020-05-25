import React, { useState } from 'react'
import { ReactComponent as TenjinIcon } from '../assets/svg/tenjin.svg';

export default function Login() {
  const [isLogin, updateIsLogin] = useState(true);
  const [isPasswordShown, updateIsPasswordShown] = useState(false);
  return (
    <div className="login">
      {
        isLogin && <form className="login-form">
        <TenjinIcon className="login-form__img"/>
        <div className="field">
          <input type="email" name="email" className="field__input" placeholder=" "/>
          <label for="email" className="field__label"> Email </label>
        </div>
        <div className="field">
          <input type={isPasswordShown ? 'text' : 'password'} name="password" className="field__input" placeholder=" "/>
          <label for="password" className="field__label"> Password </label>
          <span className="toggle-password" onClick={() => updateIsPasswordShown(!isPasswordShown)}>
            { isPasswordShown ? '🙈' : '👁️' }
          </span>
        </div>

        <div className="btn login-form__btn">Sign In</div>
        <div className="btn login-form__option" onClick={() => updateIsLogin(false)}> or <span>Register</span></div>
      </form>
      }
      {
        !isLogin && <form className="login-form">
        <TenjinIcon className="login-form__img"/>
        <div className="field">
          <input type="username" name="username" className="field__input" placeholder=" "/>
          <label for="username" className="field__label"> Username </label>
        </div>
        <div className="field">
          <input type="email" name="email" className="field__input" placeholder=" "/>
          <label for="email" className="field__label"> Email </label>
        </div>
        <div className="field">
          <input type="password" name="password" className="field__input" placeholder=" "/>
          <label for="password" className="field__label"> Password </label>
        </div>

        <div className="btn login-form__btn">Register</div>
        <div className="btn login-form__option" onClick={() => updateIsLogin(true)}> or <span>Sign In</span></div>
      </form>
      }
    </div>
  )
}
