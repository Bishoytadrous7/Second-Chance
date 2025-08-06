import './App.css';
import { Link, useRoutes } from 'react-router-dom';
import { useState, useEffect } from "react";
import ReadPosts from './pages/ReadPosts';       
import CreatePost from './pages/CreatePost';     
import EditPost from './pages/EditPost';         
import PostDetail from './pages/PostDetail';     
import Login from './components/Login';
import Signup from './components/Signup';



const App = () => {
  const [colorScheme, setColorScheme] = useState("dark"); 

  useEffect(() => {
    document.body.setAttribute("data-theme", colorScheme);
  }, [colorScheme]);

  function handleSchemeChange(e) {
    setColorScheme(e.target.value);
    document.body.setAttribute("data-theme", e.target.value);
  }

  const element = useRoutes([
    { path: '/', element: <ReadPosts /> },
    { path: '/new', element: <CreatePost /> },
    { path: '/edit/:id', element: <EditPost /> },
    { path: '/post/:id', element: <PostDetail /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
  ]);

  return (
    <div className="App">
      <header className="header">
        <h1>Second Chance</h1>
        <Link to="/"><button className="headerBtn">View Posts</button></Link>
        <Link to="/new"><button className="headerBtn">Add Post</button></Link>
        <Link to="/login"><button className="headerBtn">Log in</button></Link>
        <Link to="/signup"><button className="headerBtn">Sign Up</button></Link>
        <select className="theme-selector" value={colorScheme} onChange={handleSchemeChange}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </header>
      {element}
    </div>
  );
};

export default App;
