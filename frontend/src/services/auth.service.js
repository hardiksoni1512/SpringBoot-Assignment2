import axios from 'axios';

const API_URL = '/api/auth/';

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + 'signin', {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(name, email, password, phoneNumber) {
    return axios.post(API_URL + 'signup', {
      name,
      email,
      password,
      phoneNumber
    });
  }

  verifyEmail(token) {
    return axios.get(API_URL + 'verify-email', {
      params: { token }
    });
  }

  forgotPassword(email) {
    return axios.post(API_URL + 'forgot-password', null, {
      params: { email }
    });
  }

  resetPassword(token, password) {
    return axios.post(API_URL + 'reset-password', {
      token,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService(); 