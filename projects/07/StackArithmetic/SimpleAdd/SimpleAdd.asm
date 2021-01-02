// push constant 7

    @7
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 8

    @8
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// add

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M+D // *SP=x(oper)y
    @SP
    M=M+1 // SP++