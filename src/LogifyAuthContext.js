import React, { createContext, useState, useEffect } from 'react';

const DOMAIN_KEY = process.env.REACT_APP_LOGIFY_DOMAINKEY;
const NOT_AUTH_DATA = { user: {}, access: {} };

const LogifyAuthContext = createContext();

export const LogifyAuthProvider = ({ children }) => {
  const [logifyAuthData, setLogifyAuthData] = useState(
    JSON.parse(localStorage.getItem('logifyAuthData')) || NOT_AUTH_DATA
  );

  useEffect(() => {
    localStorage.setItem('logifyAuthData', JSON.stringify(logifyAuthData));
  }, [logifyAuthData]);

  useEffect(() => {
    window.addEventListener('message', onLoginMessage, false);
    return () => {
      window.removeEventListener('message', onLoginMessage);
    };
  }, []);

  const onLoginMessage = (event) => {
    if (event.origin !== 'https://logify.id') return;
    if (event.data.user) setLogifyAuthData(event.data);
  };

  const auth = {
    onLogin: () =>
      window.open(
        `https://logify.pw/login?dk=${DOMAIN_KEY}&platform=jj`,
        'authWindow'
      ),
    onLogout: () => setLogifyAuthData(NOT_AUTH_DATA),
    hasAccess: (appVersionId, path) => {
      if (!logifyAuthData.user.id) return undefined;
      try {
        return (
          path
            .split('.')
            .reduce((o, i) => o[i], logifyAuthData.access[appVersionId]) ||
          false
        );
      } catch (e) {}
    },
  };

  return (
    <LogifyAuthContext.Provider value={{ ...logifyAuthData, ...auth }}>
      {children}
    </LogifyAuthContext.Provider>
  );
};

export const useLogifyAuth = () => {
  const context = React.useContext(LogifyAuthContext);
  if (context === undefined)
    throw new Error('useAuth must be used within a AuthProvider');
  return context;
};
