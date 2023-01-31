import React, { Component } from 'react';
import Instructions from './Instructions';
import './styles.css';

class Calculator extends Component {
    OPEATORS = ['+', '-', '*', '/'];
    constructor() {
        super();
        this.state = {
            result: 0,
            prompt: []
        }
        this.clear = this.clear.bind(this);
        this.result = this.result.bind(this);
        this.keyListener();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.prompt !== this.state.prompt) {
            this.result();
        }
    }

    keyListener() {
        document.addEventListener('keydown', (event) => {
            var name = event.key;
            var code = event.code;
            if (isFinite(name)) {
                this.addToPrompt(parseInt(name));
            }
            if (this.OPEATORS.includes(name)) {
                this.addToPrompt(name);
            }
            if (code === 'Enter') {
                this.result();
            }
            if (code === 'Backspace') {
                this.setState({ prompt: this.state.prompt.slice(0, -1) });
            }
        }, false);
    }

    addToPrompt(op) {
        if (this.OPEATORS.includes(op)) {
            if (this.state.prompt.length == 0) {
                console.error("Error de sintaxis. No agregar operadores al inicio");
                this.setState({
                    result: 'Error de Sintaxis'
                });
                return;
            }
            if (this.OPEATORS.includes(this.state.prompt[this.state.prompt.length - 1])) {
                console.error("Error de sintaxis. No agregar dos operadores seguidos");
                this.setState({
                    result: 'Error de Sintaxis'
                });
                return;
            }
        }
        this.setState({ prompt: [...this.state.prompt, op] });
    }

    clear() {
        this.setState({
            prompt: [],
            result: 0
        });
    }
    processResult(numbers, operators) {
        let resultado = 0, operatorsIdx = 0;
        numbers.forEach(num => {
            if (resultado == 0) {
                resultado = num;
                return;
            }
            if (operatorsIdx < operators.length) {
                let operator = operators[operatorsIdx];
                switch (operator) {
                    case '+':
                        resultado += num;
                        break;
                    case '-':
                        resultado -= num;
                        break;
                    case '*':
                        resultado *= num;
                        break;
                    case '/':
                        resultado /= num;
                        break;
                    default:
                        break;
                }
                operatorsIdx++;
            }
        });

        return resultado;
    }

    result() {
        const array = [...this.state.prompt];
        let operators = [];
        let numbers = [];
        let numStr = '';
        array.forEach((val, idx) => {
            if (typeof val == 'number') {
                numStr += val;
                if (array.length == idx + 1) {
                    numbers.push(parseInt(numStr));
                    numStr = '';
                }
            }
            if (typeof val == 'string') {
                operators.push(val);
                numbers.push(parseInt(numStr));
                numStr = '';
            }
        });
        //Ordenar jerarquia
        let newNumbers = [...numbers];
        let newOp = [...operators];
        let j = 0;
        operators.forEach((op, idx) => {
            if (['*', '/'].includes(op)) {
                let newNum = 0;
                switch (op) {
                    case '*':
                        newNum = newNumbers[idx - j] * newNumbers[idx - j + 1];
                        break;
                    case '/':
                        newNum = newNumbers[idx - j] / newNumbers[idx - j + 1];
                        break;
                    default:
                        break;
                }
                newNumbers[idx - j] = newNum;
                newOp.splice(idx - j, 1);
                newNumbers.splice(idx - j + 1, 1);
                j++;
            }
        });
        numbers = newNumbers;
        operators = newOp;

        let res = this.processResult(numbers, operators);
        if (isNaN(res)) {
            res = 'Error de Sintaxis';
        }
        this.setState({
            result: res
        });
    }
    render() {
        return <div className='container'>
            <div className='calc'>
                <h1 style={{textAlign: 'center', fontSize: '20px', marginBottom: '1em'}}>{'Calculadora con React < 16.8'}</h1>
                <div className="calc-container">
                    <div className="result">
                        <div className="prompt">{this.state.prompt}</div>
                        <div className="result-prompt">{this.state.result}</div>
                    </div>
                    <div className="buttons">
                        <div className="numbers-buttons">
                            <button className="btn-7" onClick={this.addToPrompt.bind(this, 7)}>7</button>
                            <button className="btn-8" onClick={this.addToPrompt.bind(this, 8)}>8</button>
                            <button className="btn-9" onClick={this.addToPrompt.bind(this, 9)}>9</button>
                            <button className="btn-4" onClick={this.addToPrompt.bind(this, 4)}>4</button>
                            <button className="btn-5" onClick={this.addToPrompt.bind(this, 5)}>5</button>
                            <button className="btn-6" onClick={this.addToPrompt.bind(this, 6)}>6</button>
                            <button className="btn-1" onClick={this.addToPrompt.bind(this, 1)}>1</button>
                            <button className="btn-2" onClick={this.addToPrompt.bind(this, 2)}>2</button>
                            <button className="btn-3" onClick={this.addToPrompt.bind(this, 3)}>3</button>
                            <button className="btn-0" onClick={this.addToPrompt.bind(this, 0)}>0</button>
                            <button className="btn-result" onClick={this.result}>=</button>
                        </div>
                        <div className="operators-buttons">
                            <div className='op-col-1'>
                                <button className="btn-mult" onClick={this.addToPrompt.bind(this, '*')}>X</button>
                                <button className="btn-div" onClick={this.addToPrompt.bind(this, '/')}>/</button>
                                <button className="btn-subs" onClick={this.addToPrompt.bind(this, '-')}>-</button>
                            </div>
                            <div className='op-col-2'>
                                <button className="btn-clear" onClick={this.clear}>C</button>
                                <button className="btn-add" onClick={this.addToPrompt.bind(this, '+')}>+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Instructions/>
            </div>
        </div>
    }
}
export default Calculator;