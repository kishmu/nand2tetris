
    // bootstrap
    @256
    D=A
    @SP
    M=D

// call Sys.init 0
    
    // push return-address
    @Sys.init.ret.0
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

    @Sys.init
    0;JMP
(Sys.init.ret.0)
// function Class1.set 0
(Class1.set)
// initialize local variables
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
// pop static 0

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @Class1.0
    M=D // *addr=D
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
// pop static 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @Class1.1
    M=D // *addr=D
// push constant 0

    @0
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
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
// function Class1.get 0
(Class1.get)
// initialize local variables
// push static 0

    @Class1.0
    D=M
    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push static 1

    @Class1.1
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
// function Class2.set 0
(Class2.set)
// initialize local variables
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
// pop static 0

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @Class2.0
    M=D // *addr=D
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
// pop static 1

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @Class2.1
    M=D // *addr=D
// push constant 0

    @0
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
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
// function Class2.get 0
(Class2.get)
// initialize local variables
// push static 0

    @Class2.0
    D=M
    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++
// push static 1

    @Class2.1
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
// function Sys.init 0
(Sys.init)
// initialize local variables
// push constant 6

    @6
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

// call Class1.set 2
    
    // push return-address
    @Class1.set.ret.0
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

    @2
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

    @Class1.set
    0;JMP
(Class1.set.ret.0)
// pop temp 0

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @R5
    M=D // *addr=D
// push constant 23

    @23
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 15

    @15
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++

// call Class2.set 2
    
    // push return-address
    @Class2.set.ret.0
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

    @2
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

    @Class2.set
    0;JMP
(Class2.set.ret.0)
// pop temp 0

    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @R5
    M=D // *addr=D

// call Class1.get 0
    
    // push return-address
    @Class1.get.ret.0
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

    @Class1.get
    0;JMP
(Class1.get.ret.0)

// call Class2.get 0
    
    // push return-address
    @Class2.get.ret.0
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

    @Class2.get
    0;JMP
(Class2.get.ret.0)
(Sys.init$WHILE)

// goto WHILE
    @Sys.init$WHILE
    0;JMP