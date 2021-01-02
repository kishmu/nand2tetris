// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// R2 = 0
// i = 0
// while (i < R1) 
//   R2 = R2 + R0
//   i = i + 1

// R2 = 0
@R2
M=0

@i
MD=0 //i=0 and D=i

(LOOP)
@R1 
D=M-D // D=R1-i
@DONE
D;JEQ

@R0
D=M  // D=R0 
@R2
M=D+M // R2=R2+R0 

@i 
MD=M+1 // i=i+1 and D=i 

@LOOP
0;JMP

(DONE)




