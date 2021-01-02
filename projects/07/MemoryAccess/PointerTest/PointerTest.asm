// push constant 3030

    @3030
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop pointer 0

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @THIS
    M=D // *addr=D
// push constant 3040

    @3040
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop pointer 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @THAT
    M=D // *addr=D
// push constant 32

    @32
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop this 2

    @SP
    AM=M-1 // SP--

    @2
    D=A
    @THIS
    D=M+D // addr = base_addr + index
    @R13 
    M=D
    @SP
    A=M
    D=M // D=*SP

    @R13
    A=M
    M=D
// push constant 46

    @46
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop that 6

    @SP
    AM=M-1 // SP--

    @6
    D=A
    @THAT
    D=M+D // addr = base_addr + index
    @R13 
    M=D
    @SP
    A=M
    D=M // D=*SP

    @R13
    A=M
    M=D
// push pointer 0

    @THIS
    D=M
    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push pointer 1

    @THAT
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
// push this 2

    @2
    D=A
    @THIS
    D=D+M // D=addr (index + segment_base_addr)
    A=D
    D=M // D=*addr

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
// push that 6

    @6
    D=A
    @THAT
    D=D+M // D=addr (index + segment_base_addr)
    A=D
    D=M // D=*addr

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