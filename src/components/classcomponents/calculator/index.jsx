import React, { Component } from 'react';
import Instructions from './Instructions';
import './styles.css';

class Calculator extends Component {
    //Constantes
    OPEATORS = ['+', '-', '*', '/'];
    LESS_PRIORITY_OP = ['+', '-'];
    HIGHER_PRIORITY_OP = ['*', '/'];
    SYNTAX_ERROR = 'Error de Sintaxis';

    constructor() {
        super();
        //Estado inicial
        this.state = {
            result: 0,
            prompt: []
        }
        //Binding de funciones para llamar en el render
        this.clear = this.clear.bind(this);
        this.result = this.result.bind(this);
        //Agrega el listener de keydown al DOM
        this.keyListener();
    }
    componentDidUpdate(prevProps, prevState) {
        //Si el estado de la entrada cambia, muestra resultado
        if (prevState.prompt !== this.state.prompt) {
            this.result();
        }
    }

    keyListener() {
        document.addEventListener('keydown', (event) => {
            var name = event.key;
            var code = event.code;
            //Si es numerico, parsear a int y agregar a la entrada
            if (isFinite(name)) {
                this.addToPrompt(parseInt(name));
            }
            //Si es un operador
            if (this.OPEATORS.includes(name)) {
                this.addToPrompt(name);
            }
            //Si presiona Enter, mostrar resultado
            if (code === 'Enter') {
                this.result();
            }
            //Si presiona Backspace (borrar), borra la ultima entrada
            if (code === 'Backspace') {
                this.setState({ prompt: this.state.prompt.slice(0, -1) });
            }
            //Si presiona C, limpia entrada y resultado
            if (name.toUpperCase() === 'C') {
                this.clear();
            }
        }, false);
    }

    addToPrompt(op) {
        if (this.OPEATORS.includes(op)) {
            //Si ingresa * o / al inicio, Error de sintaxis
            if (this.state.prompt.length == 0 && this.HIGHER_PRIORITY_OP.includes(op)) {
                console.error("Error de sintaxis. No agregar operadores al inicio");
                this.setState({
                    result: this.SYNTAX_ERROR
                });
                return;
            }
            //Si agrega dos operadores seguidos, Error de sintaxis
            if (this.OPEATORS.includes(this.state.prompt[this.state.prompt.length - 1])) {
                console.error("Error de sintaxis. No agregar dos operadores seguidos");
                this.setState({
                    result: this.SYNTAX_ERROR
                });
                return;
            }
        }
        this.setState({ prompt: [...this.state.prompt, op] });
    }

    clear() {
        //Limpia el estado
        this.setState({
            prompt: [],
            result: 0
        });
    }
    processResult(numbers, operators) {
        let resultado, operatorsIdx = 0;
        numbers.forEach(num => {
            //Si el acumulador (resultado) esta undefined, el acumulador se inicializa con el primer valor de la entrada
            if (typeof resultado === 'undefined') {
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
        //Si el resultado no fue definido despues de iterar, retorna 0
        if (!resultado) {
            return 0;
        }
        return resultado;
    }

    result() {
        //Organizar los valores del array de entradas 
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
                if (idx === 0 && this.LESS_PRIORITY_OP.includes(val)) {
                    numbers.push(0);
                } else {
                    numbers.push(parseInt(numStr));
                    numStr = '';
                }
            }
        });
        //Operar jerarquia
        let newNumbers = [...numbers];
        let newOp = [...operators];
        let j = 0;
        operators.forEach((op, idx) => {
            //Si el operador es de alta prioridad en jerarquia, opera primero y agrega a los numeros de entrada
            if (this.HIGHER_PRIORITY_OP.includes(op)) {
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
        //Obtener el resultado de la operacion
        let res = this.processResult(numbers, operators);

        //Si el resultado no es un número, retornar error de sintaxis
        if (isNaN(res)) {
            res = this.SYNTAX_ERROR;
        }
        this.setState({
            result: res
        });
    }
    render() {
        return <div className='container'>
            <div className='calc'>
                <h1 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '1em' }}>{'Calculadora con React < 16.8'}</h1>
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
                <Instructions />
            </div>
        </div>
    }
}
export default Calculator;