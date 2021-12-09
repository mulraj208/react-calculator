/**
 * Shunting yard algorithm
 * See: https://en.m.wikipedia.org/wiki/Shunting-yard_algorithm
 *
 * Watch the below video for better understanding
 * https://www.youtube.com/watch?v=y_snKkv0gWc
 *
 * Converts infix notation to postfix notation
 *
 *
 */
class ShuntingYard {
    constructor() {
        // eslint-disable-next-line no-extend-native
        Array.prototype.peek = function () {
            return this[this.length - 1];
        };
    }

    convertInfixToPostfixNotation(string) {
        // operators set
        const operators = {"+": 1, "-": 1, "*": 1, "/": 1};

        // associations (left / right) sets
        const leftAssoc = {"*": 1, "/": 1, "%": 1, "+": 1, "-": 1};
        const rightAssoc = {"=": 1, "!": 1};

        /**
         * precedenceOf
         *
         * precedence   operators       associativity
         * 1            !               right to left
         * 2            * / %           left to right
         * 3            + -             left to right
         * 4            =               right to left
         */
        const precedenceOf = {
            "!": 4,
            "*": 3,
            "/": 3,
            "%": 3,
            "+": 2,
            "-": 2,
            "=": 1
        };

        const modifiedString = this.appendUnderscoreForMultipleDigits(string);
        let output = [];
        let stack = [];

        for (let k = 0; k < modifiedString.length; k++) {

            // current char
            const ch = modifiedString[k];

            // skip whitespaces
            if (ch === " ") {
                continue;
            }

            // if it's a number, add it to the output queue
            // or if it's a "_"
            if (/\d/.test(ch) || ch === '_') {
                output.push(ch);
            }

            // if the token is an operator, op1, then:
            else if (ch in operators) {

                const op1 = ch; // just for readability

                // while ...
                while (stack.length > 0) {

                    // ... there is an operator token, op2, at the top of the stack
                    const op2 = stack.peek();

                    if (op2 in operators && (
                        // and op1 is left-associative and its precedence is less than or equal to that of op2,
                        (op1 in leftAssoc && (precedenceOf[op1] <= precedenceOf[op2])) ||
                        // or op1 is right-associative and its precedence is less than that of op2,
                        (op1 in rightAssoc && (precedenceOf[op1] < precedenceOf[op2]))
                    )) {

                        // push op2 onto the output queue
                        output.push(stack.pop()); // op2

                    } else {
                        break;
                    }

                }

                // push op1 onto the stack
                stack.push(op1);

            }

            // if the token is a left parenthesis, then push it onto the stack.
            else if (ch === "(") {
                stack.push(ch);
            }

            // if the token is a right parenthesis:
            else if (ch === ")") {

                let foundLeftParen = false;

                // until the token at the top of the stack is a left parenthesis,
                // pop operators off the stack onto the output queue
                while (stack.length > 0) {
                    const c = stack.pop();
                    if (c === "(") {
                        foundLeftParen = true;
                        break;
                    } else {
                        output.push(c);
                    }
                }

                // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
                if (!foundLeftParen) {
                    throw new Error("Parentheses mismatched");
                }
            } else {
                throw new Error(`Unknown token: ${ch}`);
            }
        }

        // when there are no more tokens to read:
        // while there are still operator tokens in the stack:
        while (stack.length > 0) {
            const c = stack.pop();

            if (c === "(" || c === ")") {
                throw new Error("Parentheses mismatched");
            }

            // push it to the output
            output.push(c);
        }

        return output.join(" ");
    }

    /**
     * Puts an underscore '_' at the beginning of each multiple digits
     * Example: 25*34-(23+1) becomes _25*_34-(_23+_1)
     *
     */
    appendUnderscoreForMultipleDigits(string) {
        return string.replaceAll(/(\w+)/g, "_$1");
    }
}

/**
 * Postfix notation math evaluator
 * See: https://en.m.wikipedia.org/wiki/Reverse_Polish_notation
 *
 */
const postfixEval = {
    evaluate(string) {
        const operators = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b
        };

        const stack = [];
        let ch; // current char
        let strForMultipleDigits = '';
        let isUnderscore = false

        for (let k = 0, length = string.length; k < length; k++) {
            ch = string[k].trim();

            // Bail out early if character is whitespace
            if (!ch) {
                continue;
            }

            const isOperator = ch in operators;

            if (ch === '_') {
                isUnderscore = true;

                if (k > 0 && strForMultipleDigits.length > 0) {
                    stack.push(strForMultipleDigits);
                }

                strForMultipleDigits = '';

                continue;
            }

            if (isUnderscore) {
                // If it's not a operator continue adding the digit to the string builder
                if (!isOperator) {
                    strForMultipleDigits += ch;
                    continue;
                } else {
                    stack.push(strForMultipleDigits);
                    strForMultipleDigits = '';
                    isUnderscore = false;
                }
            }

            // if it's a value, push it onto the stack
            if (/\d/.test(ch)) {
                stack.push(ch);
            } else if (isOperator) { // else if it's an operator
                const b = +stack.pop();
                const a = +stack.pop();

                const value = operators[ch](a, b);
                stack.push(value);
            }
            // else we just skip whitespaces
        }

        if (stack.length > 1) {
            throw new Error("ParseError: " + string + ", stack: " + stack);
        }

        return stack[0];
    }
};

export function evaluateExpression(str) {
    let value = '';

    try {
        const shuntingYard = new ShuntingYard();
        const postFixNotation = shuntingYard.convertInfixToPostfixNotation(str);
        value = postfixEval.evaluate(postFixNotation);
    } catch (e) {
        return {
            success: false,
            value: 0,
            message: e.message,
        }
    }

    if (isNaN(value)) {
        return {
            success: false,
            value: 0,
            message: 'Invalid Expression',
        }
    }

    return {
        success: true,
        value,
        message: '',
    };
}
