import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Aquí puedes agregar tu navegación/header */}
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            {/* Aquí puedes agregar más rutas */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
