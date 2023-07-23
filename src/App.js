import Home from "./pages/Home";
import Func from "./pages/Func";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


function App() {
    const [selected, onSelected] = useState(undefined);
    const data = useSelector(state => state);
    console.log(data);
    const navigate = useNavigate();

    const onSelect = (i) => {
        onSelected(i);
        navigate("/monitoring")
    }
    return (
            <div className='app'>
                {selected>=0
                    ?<Func onSelect={onSelect} selected={selected}/>
                    :<Home onSelect={onSelect}/>}
            </div>
    );
}

export default App;
