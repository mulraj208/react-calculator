import {useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import {evaluateExpression} from "./utils";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const date = (new Date());
    const [expressionStr, setExpressionStr] = useState('');
    const [sum, setSum] = useState('');

    function clearExpressionStr() {
        setExpressionStr('');
        setSum('');
    }

    function calculateSum() {
        const {success, value, message} = evaluateExpression(expressionStr);

        if (message && !success) {
            toast(message);
        }

        setSum(value);
    }

    function appendToExpression(str) {
        setExpressionStr(prevStr => (prevStr += str));
    }

    function deleteLastCharacter() {
        setExpressionStr(prevStr => prevStr.slice(0, -1));
    }

    return (
        <div className="bg-gray-200 w-screen h-screen flex justify-center items-center">
            <div className="w-64 h-auto bg-white rounded-2xl shadow-xl border-4 border-gray-100">
                <div className="w-auto mx-3 my-2 h-6 flex justify-between">
                    <div className="text-sm">
                        {date.getHours() + ":" + date.getMinutes()}
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                        <i className="fas fa-signal"/>
                        <i className="fas fa-wifi"/>
                        <i className="fas fa-battery-three-quarters text-sm"/>
                    </div>
                </div>
                <div className="w-auto m-3 h-40 text-right space-y-2 py-2">
                    <input
                        type="text"
                        className="h-20 w-full border border-gray-200 px-2 py-3"
                        value={expressionStr}
                        onChange={(e) => setExpressionStr(e.target.value)}
                    />
                    <div className="text-black font-bold text-3xl">{sum}</div>
                </div>
                <div className="w-auto m-1 h-auto mb-2">
                    <div className="m-2 flex justify-between">
                        <button className="btn-yellow" onClick={clearExpressionStr}>C</button>
                        <button className="btn-grey" onClick={() => appendToExpression('(')}>(</button>
                        <button className="btn-grey" onClick={() => appendToExpression(')')}>)</button>
                        <button className="btn-orange" onClick={() => appendToExpression('/')}>/</button>
                    </div>
                    <div className="m-2 flex justify-between">
                        <button className="btn-grey" onClick={() => appendToExpression('7')}>7</button>
                        <button className="btn-grey" onClick={() => appendToExpression('8')}>8</button>
                        <button className="btn-grey" onClick={() => appendToExpression('9')}>9</button>
                        <button className="btn-orange" onClick={() => appendToExpression('*')}>x</button>
                    </div>
                    <div className="m-2 flex justify-between">
                        <button className="btn-grey" onClick={() => appendToExpression('4')}>4</button>
                        <button className="btn-grey" onClick={() => appendToExpression('5')}>5</button>
                        <button className="btn-grey" onClick={() => appendToExpression('6')}>6</button>
                        <button className="btn-orange" onClick={() => appendToExpression('-')}>-</button>
                    </div>
                    <div className="m-2 flex justify-between">
                        <div className="btn-grey" onClick={() => appendToExpression('1')}>1</div>
                        <div className="btn-grey" onClick={() => appendToExpression('2')}>2</div>
                        <div className="btn-grey" onClick={() => appendToExpression('3')}>3</div>
                        <div className="btn-orange" onClick={() => appendToExpression('+')}>+</div>
                    </div>
                    <div className="m-2 flex justify-between">
                        <button className="btn-grey-jumbo" onClick={() => appendToExpression('0')}>0</button>
                        <div className="flex w-full ml-3 justify-between">
                            <button className="btn-grey" onClick={deleteLastCharacter}>Del</button>
                            <button className="btn-green" onClick={calculateSum}>=</button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-5">
                        <div className="w-20 h-1 bg-gray-100 rounded-l-xl rounded-r-xl"/>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
