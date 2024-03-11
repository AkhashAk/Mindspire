import Home from "./components/Home.js";
import Create from "./components/AddBlog.js";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { Navigate, Route, Routes } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons';
import './App.css';
import Layout from "./components/Layout.js";
import { Blog } from "./components/Blog/Blog.js";


function App() {
  library.add(fas, faTwitter, faFontAwesome);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route exact path="/blog/:blogId" element={<Blog />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path="/create" element={<Create />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;