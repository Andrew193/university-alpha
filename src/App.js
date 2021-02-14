import { Route } from 'react-router-dom';
import './App.css';
import Header from "./components/header/header"
import Footer from "./components/footer/footer"
import MainPage from "./components/mainPage/mainPage"
function App() {
  return (
    <div className="App">
      <Header />
      <Route exact path={"/"} render={()=><MainPage />}/>
      <Footer />
    </div>
  );
}

export default App;
