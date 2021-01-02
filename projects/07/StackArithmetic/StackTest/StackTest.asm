// push constant 17

    @17
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 17

    @17
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// eq

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-StackTest-0
  D;JEQ 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-0
  0;JMP
  (IF-StackTest-0)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-0)
  @SP
  M=M+1 // SP++
// push constant 17

    @17
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 16

    @16
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// eq

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-StackTest-1
  D;JEQ 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-1
  0;JMP
  (IF-StackTest-1)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-1)
  @SP
  M=M+1 // SP++
// push constant 16

    @16
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 17

    @17
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// eq

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-StackTest-2
  D;JEQ 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-2
  0;JMP
  (IF-StackTest-2)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-2)
  @SP
  M=M+1 // SP++
// push constant 892

    @892
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 891

    @891
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
  @IF-StackTest-3
  D;JLT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-3
  0;JMP
  (IF-StackTest-3)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-3)
  @SP
  M=M+1 // SP++
// push constant 891

    @891
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 892

    @892
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
  @IF-StackTest-4
  D;JLT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-4
  0;JMP
  (IF-StackTest-4)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-4)
  @SP
  M=M+1 // SP++
// push constant 891

    @891
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 891

    @891
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
  @IF-StackTest-5
  D;JLT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-5
  0;JMP
  (IF-StackTest-5)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-5)
  @SP
  M=M+1 // SP++
// push constant 32767

    @32767
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 32766

    @32766
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// gt

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-StackTest-6
  D;JGT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-6
  0;JMP
  (IF-StackTest-6)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-6)
  @SP
  M=M+1 // SP++
// push constant 32766

    @32766
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 32767

    @32767
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// gt

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-StackTest-7
  D;JGT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-7
  0;JMP
  (IF-StackTest-7)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-7)
  @SP
  M=M+1 // SP++
// push constant 32766

    @32766
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 32766

    @32766
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// gt

  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @IF-StackTest-8
  D;JGT 
  // false
  @SP
  A=M
  M=0
  @ENDIF-StackTest-8
  0;JMP
  (IF-StackTest-8)
  // true
  @SP
  A=M
  M=-1
  (ENDIF-StackTest-8)
  @SP
  M=M+1 // SP++
// push constant 57

    @57
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 31

    @31
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// push constant 53

    @53
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
// push constant 112

    @112
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
// neg

    @SP
    AM=M-1 // pop
    M=-M
    @SP
    M=M+1 // SP++
// and

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M&D // *SP=x(oper)y
    @SP
    M=M+1 // SP++
// push constant 82

    @82
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++
// or

    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M|D // *SP=x(oper)y
    @SP
    M=M+1 // SP++
// not

    @SP
    AM=M-1 // pop
    M=!M
    @SP
    M=M+1 // SP++