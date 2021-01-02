// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

// loop:
//  scan key 
//  if (pressedkey > 0) // some key pressed
//   color = -1 // black (1111 1111 1111 1111)
//  else  
//   color = 0 // white
//  end if 
//  fillscreen(color)

//  function fillscreen(i) {
//    i = 0
//    while (i < 8192) // 8193=32 (16B-word in each row) * 256 (rows)
//      SCREEN[I] = COLOR 
//  end function 
//
// go to loop

(LOOP)
  @KBD
  D=M // D=keyboard 
  @RESET
  D;JEQ // if keyboard=0 then reset

  @color
  M=-1 // black

  @FILLSCREEN
  0;JMP

(RESET)
  @color 
  M=0 // white 

(FILLSCREEN)
  @8192
  D=A // D=8192
  @SCREEN
  D=D+A // D = 8192+screen base address (screen end)

  @i 
  M=D // i = screen end  

  (WHILELOOP)
    @SCREEN
    D=A
    @i
    D=M-D 
    @DONE
    D;JLT // i < screenbase, we are done

    // fill screen
    @color
    D=M
    @i
    A=M // A points to screen location i 
    M=D // write screen with color value

    // i--
    @i 
    M=M-1 

    @WHILELOOP
    0;JMP

(DONE)
@LOOP
0;JEQ