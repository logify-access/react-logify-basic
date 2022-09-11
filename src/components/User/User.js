import React, { useState, useEffect } from 'react';
import { localCurrentDateTimeString } from '../../util/localCurrentDateTimeString';
import { useLogify } from 'react-logify';
import './User.css';

const LanguageNames = new Intl.DisplayNames('en', { type: 'language' });

export const User = () => {
  const { user, onLogin, onLogout } = useLogify();

  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const timer = setInterval(
      () =>
        setCurrentTime(
          user.timezone ? localCurrentDateTimeString(user.timezone) : ''
        ),
      1000
    );
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div>
      {user.id ? (
        <>
          <button onClick={onLogout}>Logout</button>
          <button onClick={onLogin}>Switch Persona</button>
        </>
      ) : (
        <button onClick={onLogin}>Login</button>
      )}

      {user.organization && (
        <div className='organization'>
          <div className='id'>
            <label>Organization ID:</label> {user.organization.id}
          </div>
          {user.organization.logo && (
            <img src={user.organization.logo} alt='' />
          )}
          <div className='name'>{user.organization.name}</div>
        </div>
      )}

      {user.id && (
        <div className='user'>
          <div className='id'>
            <div>
              <label>User ID:</label> {user.id}
            </div>
            <div>
              <label>Profile ID:</label> {user.profileId}
            </div>
            <div>
              <label>Timezone:</label> {user.timezone}
            </div>
            <div>
              <label>User local time:</label> <small>{currentTime}</small>
            </div>
          </div>
          {user.pic && <img src={user.pic} alt='' />}
          <div className='name'>{user.name}</div>
          {user.organization && (
            <div className='designation'>
              {user.organization.designation} ({user.organization.staffId})
            </div>
          )}
          <div className='email'>{user.email}</div>
          <div className='languages'>
            {user.language.map((ln) => (
              <div key={ln} className='language'>
                {LanguageNames.of(ln)}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className='user'>
        {user.id ? <b>Logged in</b> : 'Not logged in '}{' '}
        {user.organization ? (
          <>
            {user.organization.internal ? (
              <>
                as <i>internal staff member</i>
              </>
            ) : (
              <>
                as <i>external staff member</i>
              </>
            )}
          </>
        ) : user.id ? (
          <>
            as <i>individual</i>
          </>
        ) : (
          ''
        )}
      </p>
    </div>
  );
};
