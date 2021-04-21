import { Route } from 'react-router-dom';
import './App.css';
import Header from "./components/header/header"
import Footer from "./components/footer/footer"
import MainPage from "./components/mainPage/mainPage"
import ColPage from "./components/ColPage/ColPage"

function App() {
  return (
    <div className="App">
     
      <Header />
      <Route exact path={"/"} render={()=><MainPage />}/>
      <Route exact path={"/col"} render={()=><ColPage />}/>
      <Footer />
    </div>
  );
}

export default App;
