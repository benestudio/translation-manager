import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Language from "../pages/languages";
import Demo from "../pages/demo";
import Messages from "../pages/messages";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Route path="/languages" component={Language}/>
        <Route path="/messages" component={Messages}/>
        <Route path="/demo" component={Demo}/>
      </Router>
    </div>
  );
}

export default App;
