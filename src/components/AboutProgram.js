import React, {useState} from 'react';
import Modal from "./shared/Modal";
import Header from "./shared/Header";
// import trollSad from "../resources/icons/troll-sad.png"
// import trollFunny from "../resources/icons/troll-funny.png";

const AboutProgram = ({onAboutProgram}) => {
    const [funny, setFunny] = useState(false);
    return (
        <Modal onClose={() => {
            onAboutProgram(false)
        }}>
            <div className="px-8 py-6 w-[600px]">
                {/*<div onClick={*/}
                {/*    (e) => {e.currentTarget.innerText = e.currentTarget.innerText.split("").reverse().join("");setFunny(!funny); }*/}
                {/*} className="text-center">улыбок тебе дед макар</div>*/}
                {/*<div className={funny?"mx-auto mt-10 animate-spin":"mx-auto mt-10"}>*/}
                {/*    <img className="w-18 h-18" src={funny?trollFunny:trollSad} alt=""/>*/}
                {/*</div>*/}
                <div className="text-center">
                    <Header>О программе</Header>
                </div>
                <div className="mt-5 text-justify indent-5 text-md">
                    Данная программа предназначена для упрощения и оптимизации вашего опыта торговли
                    предметами между сайтами Steam и Market.CSGO.
                </div>
                <div className="mt-2 text-justify indent-5 text-md">
                    Если вы активно участвуете в торговле предметами игры
                    Counter-Strike: Global Offensive, то бот поможет вам значительно сэкономить время и усилия, а также
                    повысить вашу эффективность в этом процессе.
                </div>

            </div>
        </Modal>
    );
};

export default AboutProgram;
