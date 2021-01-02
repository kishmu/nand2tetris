// push constant 0

    @0
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
(glob$LOOP_START)
// push argument 0

    @0
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
// add

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M+D // *SP=x(oper)y
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
// push argument 0

    @0
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
// push constant 1

    @1
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
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
// pop argument 0

    @SP
    AM=M-1 // SP--

    @0
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
// push argument 0

    @0
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

    // if-goto LOOP_START
    @SP
    AM=M-1 // pop
    D=M
    @glob$LOOP_START
    D;JNE
    
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