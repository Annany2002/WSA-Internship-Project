import { useEffect, useState } from 'react';
import './SignInBox.scss';
import { useDispatch } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import { GoMarkGithub } from 'react-icons/go';
// import { BsGoogle } from 'react-icons/bs';
import { login } from '../../redux/slice/authSlice';
import { updateSigninSideVisible } from '../../redux/slice/loginSlice';
import Swal from 'sweetalert2';
import validator from 'validator';
import { ReactComponent as LoadingIcon } from './../../assets/loading.svg';
import axios from 'axios';
import { LOGIN_API_LINK } from '../../utils/config';

const SignInBox = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState('');
  const [errorIn, setErrorIn] = useState('');

  const changeHandler = e => {
    setErrorIn('');
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  function handleCallbackResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
  }

  // useEffect(() => {
  //   /* global google */
  //   google.accounts.id.initialise({
  //     client_id: "413799589006-r1aq5utqj5fsper51cegipiv73t6kb2b.apps.googleusercontent.com",
  //     callback: handleCallbackResponse
  //   });
  //   google.accounts.id.renderButton(
  //     document.getElementById("g_id_onload"),
  //     { theme: 'outline', size: 'large' }
  //   );
  // }, []);

  const loginHandler = async () => {
    if (!validator.isEmail(state.email.trim())) {
      return setErrorIn('email');
    }
    if (state.password.trim().length < 8) {
      return setErrorIn('password');
    }
    setIsLoggingIn('emailpass');
    try {
      const { data } = await axios.post(LOGIN_API_LINK, state);
      dispatch(login(data?.data?.user));
      window.localStorage.setItem('token', data?.data?.user?.token);
      setIsLoggingIn('');
      dispatch(updateSigninSideVisible(false));
      Swal.fire('Success!', `You're log in successfully!`, 'success');
    } catch (error) {
      Swal.fire('Failed!', error?.response?.data?.message, 'error');
      setIsLoggingIn('');
    }
  };

  return (
    <div className="signin-box">
      {errorIn && (
        <div className="err-text">
          {errorIn === 'email'
            ? 'Please enter a valid email!'
            : 'Password should atleast 8 character long!'}
        </div>
      )}
      <input
        type="email"
        value={state.name}
        onChange={changeHandler}
        name="email"
        placeholder="Email"
        className={`${errorIn === 'email' ? 'err' : ''}`}
      />
      <div>
        <input
          type={`${isPasswordVisible ? 'text' : 'password'}`}
          value={state.password}
          onChange={changeHandler}
          name="password"
          placeholder="Password"
          className={`${errorIn === 'password' ? 'err' : ''}`}
        />

        {isPasswordVisible ? (
          <AiOutlineEyeInvisible
            onClick={() => setIsPasswordVisible(prev => !prev)}
            className="eye"
          />
        ) : (
          <AiOutlineEye
            onClick={() => setIsPasswordVisible(prev => !prev)}
            className="eye"
          />
        )}
      </div>
      <button disabled={isLoggingIn} onClick={loginHandler}>
        {isLoggingIn === 'emailpass' ? (
          <LoadingIcon className="loading-icon" />
        ) : (
          'LOGIN'
        )}
      </button>
      {/* <div id='g_id_onload'></div> */}
    </div>
  );
};

export default SignInBox;
