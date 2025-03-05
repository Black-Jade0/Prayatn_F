import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import ChangeStatus from "./Pages/ChangeStatus";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/ChangeStatus" element={<ChangeStatus />}></Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
