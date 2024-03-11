import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blogs } from './Blog/Blogs';
import Login from './Login';
import { useSelector } from 'react-redux';
import { authorizedUser } from '../features/userSlice';

export default function Home() {
  const auth = useSelector(authorizedUser);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Auth === ", auth);
    if (auth == null) {
      return navigate("/login");
    }
  }, [auth]);

  return (
    <React.Fragment>
      {
        auth ?
          <div>
            <section className='blogs-container'>
              <Blogs />
            </section>
          </div>
          :
          <Login />
      }
    </React.Fragment>
  )
}