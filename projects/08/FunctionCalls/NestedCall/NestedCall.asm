// function Sys.init 0
(Sys.init)
// initialize local variables
// push constant 4000

    @4000
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
// push constant 5000

    @5000
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

// call Sys.main 0
    
    // push return-address
    @Sys.main.ret.0
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push LCL
    @LCL
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push ARG
    @ARG
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push THIS
    @THIS
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push THAT
    @THAT
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    @0
    D=A
    @5
    D=D+A 
    @SP
    D=M-D 
    @ARG
    M=D // ARG=SP-(n+5)

    @SP
    D=M
    @LCL
    M=D // LCL=SP

    @Sys.main
    0;JMP
(Sys.main.ret.0)
// pop temp 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @R6
    M=D // *addr=D
(Sys.init$LOOP)

// goto LOOP
    @Sys.init$LOOP
    0;JMP
// function Sys.main 5
(Sys.main)
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

    @SP
    A=M
    M=0
    @SP
    M=M+1
// push constant 4001

    @4001
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
// push constant 5001

    @5001
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
// push constant 200

    @200
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop local 1

    @SP
    AM=M-1 // SP--

    @1
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
// push constant 40

    @40
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop local 2

    @SP
    AM=M-1 // SP--

    @2
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
// push constant 6

    @6
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// pop local 3

    @SP
    AM=M-1 // SP--

    @3
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
// push constant 123

    @123
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++

// call Sys.add12 1
    
    // push return-address
    @Sys.add12.ret.0
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push LCL
    @LCL
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push ARG
    @ARG
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push THIS
    @THIS
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    // push THAT
    @THAT
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1

    @1
    D=A
    @5
    D=D+A 
    @SP
    D=M-D 
    @ARG
    M=D // ARG=SP-(n+5)

    @SP
    D=M
    @LCL
    M=D // LCL=SP

    @Sys.add12
    0;JMP
(Sys.add12.ret.0)
// pop temp 0

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @R5
    M=D // *addr=D
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
// push local 2

    @2
    D=A
    @LCL
    A=D+M 
    D=M

    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push local 3

    @3
    D=A
    @LCL
    A=D+M 
    D=M

    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push local 4

    @4
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
// add

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M+D // *SP=x(oper)y
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
// add

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M+D // *SP=x(oper)y
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
// function Sys.add12 0
(Sys.add12)
// initialize local variables
// push constant 4002

    @4002
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
// push constant 5002

    @5002
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
// push constant 12

    @12
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