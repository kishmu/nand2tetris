// function SimpleFunction.test 2
(SimpleFunction.test)
// initialize local variables

    @SP
    A=M
    M=0
    @SP
    M=M+1

    @SP
    A=M
    M=0
    @SP
    M=M+1
// push local 0

    @0
    D=A
    @LCL
    A=D+M 
    D=M

    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push local 1

    @1
    D=A
    @LCL
    A=D+M 
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
// not

    @SP
    AM=M-1 // pop
    M=!M
    @SP
    M=M+1 // SP++
// push argument 0

    @0
    D=A
    @ARG
    A=D+M 
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
// push argument 1

    @1
    D=A
    @ARG
    A=D+M 
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
// function return

// FRAME=LCL
    @LCL
    D=M
    @FRAME
    M=D
// RET=*(FRAME-5)
    @5
    A=D-A
    D=M
    @RET
    M=D
// *ARG = pop()
    @SP
    AM=M-1
    D=M
    @ARG
    A=M
    M=D
// SP = ARG+1
    @ARG
    D=M+1
    @SP
    M=D
// THAT = *(FRAME-1)
    @FRAME
    A=M-1
    D=M
    @THAT
    M=D
// THIS = *(FRAME-2)
    @2
    D=A
    @FRAME
    A=M-D
    D=M
    @THIS
    M=D
// ARG = *(FRAME-3)
    @3
    D=A
    @FRAME
    A=M-D
    D=M
    @ARG
    M=D
// LCL = *(FRAME-4)
    @4
    D=A
    @FRAME
    A=M-D
    D=M
    @LCL
    M=D
// goto RET
    @RET
    A=M
    0;JMP