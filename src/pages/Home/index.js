import * as React from 'react';
// import {  useHistory } from 'react-router-dom'
import './home.css';

import Particles from 'react-tsparticles';
import Typed from 'typed.js';
import { GoogleLogin } from 'react-google-login';
import CircularProgress from '@mui/material/CircularProgress';
import imgHome from './home.svg';
import minTicLogo from './logo-mision.png';

import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';

/* const initialState = {
    name: '',
    email: '',
    err: '',
    success: ''
} */

export default function Home() {
  // const history = useHistory()
  const { isFetching, /* error, */ dispatch } = React.useContext(AuthContext);

  const googleSuccess = (res) => {
    const user = {
      tokenId: res.tokenId,
      name: res.profileObj.name,
      email: res.profileObj.email,
      avatar: res.profileObj.avatar
    };
    loginCall(user, dispatch);
  };

  const googleFailure = async (err) => {
    console.log(err);
    console.log('Google Sign In was unsuccessful. Try Again Later');
  };

  /* const particlesInit = (main) => {};

  const particlesLoaded = (container) => {}; */

  const el = React.useRef(null);
  // Create reference to store the Typed instance itself
  const typed = React.useRef(null);

  React.useEffect(() => {
    const options = {
      strings: [
        'Gestión de ingreso al sistema de información.',
        'Módulo administrador de productos.',
        'Módulo administrador de ventas.',
        'Gestión de usuarios.',
        '<a href="https://github.com/Orloxx23" target="_blank" class="optionLink"><i>Orlando Mina Madroñero</i></a>'
      ],
      typeSpeed: 50,
      backSpeed: 50
    };

    // elRef refers to the <span> rendered below
    typed.current = new Typed(el.current, options);

    return () => {
      // Make sure to destroy Typed instance during cleanup
      // to prevent memory leaks
      typed.current.destroy();
    };
  }, []);

  return (
    <div className="home-screen">
      <div className="particles">
        <Particles
          id="tsparticles"
          // init={particlesInit}
          // loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: '#ffff'
              }
            },
            fullScreen: {
              zIndex: 1
            },
            interactivity: {
              events: {
                onClick: {
                  enable: false,
                  mode: 'repulse'
                },
                onHover: {
                  enable: false,
                  mode: 'bubble'
                }
              },
              modes: {
                bubble: {
                  distance: 250,
                  duration: 2,
                  opacity: 0,
                  size: 0
                },
                grab: {
                  distance: 400
                },
                repulse: {
                  distance: 400
                }
              }
            },
            particles: {
              color: {
                value: '#f03877'
              },
              links: {
                color: {
                  value: '#f03877'
                },
                distance: 150,
                opacity: 0.4
              },
              move: {
                attract: {
                  rotate: {
                    x: 600,
                    y: 600
                  }
                },
                enable: true,
                outModes: {
                  bottom: 'out',
                  left: 'out',
                  right: 'out',
                  top: 'out'
                },
                random: true,
                speed: 1
              },
              number: {
                density: {
                  enable: true
                },
                value: 160
              },
              opacity: {
                random: {
                  enable: true
                },
                value: {
                  min: 0,
                  max: 1
                },
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0
                }
              },
              size: {
                random: {
                  enable: true
                },
                value: {
                  min: 1,
                  max: 3
                },
                animation: {
                  speed: 4,
                  minimumValue: 0.3
                }
              }
            }
          }}
        />
      </div>
      <div className="home-container">
        <div className="home-content">
          <div className="home-content-left">
            <img src={imgHome} className="imgPro" alt="Programming" />
          </div>
          <hr className="hr" />
          <div className="home-content-right">
            <div className="home-top">
              <div className="home-img">
                <img src={minTicLogo} alt="MisiónTIC2022" />
              </div>
              <div className="home-button">
                <GoogleLogin
                  clientId="155052294302-d7rjjhrng5ub0pfjjvkvrv3igu424uvi.apps.googleusercontent.com"
                  render={(renderProps) => (
                    // eslint-disable-next-line react/button-has-type
                    <button
                      className="bn632-hover bn27"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      {isFetching ? <CircularProgress color="primary" size={25} /> : 'Entrar'}
                    </button>
                  )}
                  buttonText="Login"
                  onSuccess={googleSuccess}
                  onFailure={googleFailure}
                  cookiePolicy="single_host_origin"
                />
              </div>
            </div>
            <div className="home-bottom">
              <div className="">
                <h4 className="type-title">Habilitación</h4>
                <div className="type-wrap">
                  <span className="type-text" style={{ whiteSpace: 'pre' }} ref={el} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
