import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from './app/store';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { fetchBlogs } from './features/blogsSlice';
import ScrollToTop from './components/ScrollToTop';

store.dispatch(fetchBlogs());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop />
      <App />
      <ToastContainer />
    </Provider>
  </BrowserRouter>
);