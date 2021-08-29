const GIHUB_BASEURL = 'https://github.com/login/oauth/authorize';
const CLIENT_ID = 'c858854fd312550afb81';
const REDIRECT_URL = 'http://localhost:3000/login/github';

export const githubAuthUrl = (state?: string, redirect?: string) => {
  return `${GIHUB_BASEURL}/?client_id=${CLIENT_ID}&scope=user&redirect_uri=${redirect || REDIRECT_URL}&state=${state}`;
};
