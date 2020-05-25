import React from 'react'
import { ReactComponent as TenjinIcon } from '../assets/svg/tenjin.svg';

export default function Login() {
  return (
    <div className="login">
      <div className="login-form">
        <TenjinIcon className="login-form__img"/>
        <form>
          <div className="field">
            <input type="email" name="email" className="field__input" placeholder=" "/>
            <label for="email" className="field__label"> Email </label>
          </div>
          <div className="field">
            <input type="password" name="password" className="field__input" placeholder=" "/>
            <label for="password" className="field__label"> Password </label>
          </div>

          <button>Sign Up</button>
        </form>
      </div>
    </div>
  )
}
