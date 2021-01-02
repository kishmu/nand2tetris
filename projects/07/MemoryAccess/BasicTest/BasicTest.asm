// push constant 10

    @10
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop local 0

    @SP
    AM=M-1 // SP--

    @0
    D=A
    @LCL
    D=M+D // addr = base_addr + index
    @R13 
    M=D
    @SP
    A=M
    D=M // D=*SP

    @R13
    A=M
    M=D
// push constant 21

    @21
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 22

    @22
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop argument 2

    @SP
    AM=M-1 // SP--

    @2
    D=A
    @ARG
    D=M+D // addr = base_addr + index
    @R13 
    M=D
    @SP
    A=M
    D=M // D=*SP

    @R13
    A=M
    M=D
// pop argument 1

    @SP
    AM=M-1 // SP--

    @1
    D=A
    @ARG
    D=M+D // addr = base_addr + index
    @R13 
    M=D
    @SP
    A=M
    D=M // D=*SP

    @R13
    A=M
    M=D
// push constant 36

    @36
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop this 6

    @SP
    AM=M-1 // SP--

    @6
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
// push constant 42

    @42
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 45

    @45
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop that 5

    @SP
    AM=M-1 // SP--

    @5
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
// pop that 2

    @SP
    AM=M-1 // SP--

    @2
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
// push constant 510

    @510
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop temp 6

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @R11
    M=D // *addr=D
// push local 0

    @0
    D=A
    @LCL
    D=D+M // D=addr (index + segment_base_addr)
    A=D
    D=M // D=*addr

    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push that 5

    @5
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
// push argument 1

    @1
    D=A
    @ARG
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
// push this 6

    @6
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
// push this 6

    @6
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
// add

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M+D // *SP=x(oper)y
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
// push temp 6

    @R11
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