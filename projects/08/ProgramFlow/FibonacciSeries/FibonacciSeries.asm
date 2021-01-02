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
// pop pointer 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @THAT
    M=D // *addr=D
// push constant 0

    @0
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop that 0

    @SP
    AM=M-1 // SP--

    @0
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
// push constant 1

    @1
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop that 1

    @SP
    AM=M-1 // SP--

    @1
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
// push constant 2

    @2
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
(glob$MAIN_LOOP_START)
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

// if-goto COMPUTE_ELEMENT
    @SP
    AM=M-1 // pop
    D=M
    @glob$COMPUTE_ELEMENT
    D;JNE
    

// goto END_PROGRAM
    @glob$END_PROGRAM
    0;JEQ
(glob$COMPUTE_ELEMENT)
// push that 0

    @0
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
// push that 1

    @1
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
// push pointer 1

    @THAT
    D=M
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
// add

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M+D // *SP=x(oper)y
    @SP
    M=M+1 // SP++
// pop pointer 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @THAT
    M=D // *addr=D
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

// goto MAIN_LOOP_START
    @glob$MAIN_LOOP_START
    0;JEQ
(glob$END_PROGRAM)