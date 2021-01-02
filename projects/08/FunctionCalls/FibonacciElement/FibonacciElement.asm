
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
// function Main.fibonacci 0
(Main.fibonacci)
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
// push constant 2

    @2
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// lt

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-Main-0
  D;JLT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-Main-0
  0;JMP
  (IF-Main-0)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-Main-0)
  @SP
  M=M+1 // SP++

// if-goto IF_TRUE
    @SP
    AM=M-1 // pop
    D=M
    @Main.fibonacci$IF_TRUE
    D;JNE
    

// goto IF_FALSE
    @Main.fibonacci$IF_FALSE
    0;JMP
(Main.fibonacci$IF_TRUE)
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
(Main.fibonacci$IF_FALSE)
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

// call Main.fibonacci 1
    
    // push return-address
    @Main.fibonacci.ret.0
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

    @Main.fibonacci
    0;JMP
(Main.fibonacci.ret.0)
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

// call Main.fibonacci 1
    
    // push return-address
    @Main.fibonacci.ret.1
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

    @Main.fibonacci
    0;JMP
(Main.fibonacci.ret.1)
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
// function Sys.init 0
(Sys.init)
// initialize local variables
// push constant 4

    @4
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++

// call Main.fibonacci 1
    
    // push return-address
    @Main.fibonacci.ret.2
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

    @Main.fibonacci
    0;JMP
(Main.fibonacci.ret.2)
(Sys.init$WHILE)

// goto WHILE
    @Sys.init$WHILE
    0;JMP