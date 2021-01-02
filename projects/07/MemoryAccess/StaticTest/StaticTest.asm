// push constant 111

    @111
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 333

    @333
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 888

    @888
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop static 8

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @StaticTest.8
    M=D // *addr=D
// pop static 3

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @StaticTest.3
    M=D // *addr=D
// pop static 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @StaticTest.1
    M=D // *addr=D
// push static 3

    @StaticTest.3
    D=M
    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push static 1

    @StaticTest.1
    D=M
    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// sub

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M-D // *SP=x(oper)y
    @SP
    M=M+1 // SP++
// push static 8

    @StaticTest.8
    D=M
    @SP
    A=M
    M=D // *SP=*addr
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