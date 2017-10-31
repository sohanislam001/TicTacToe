function ChangeBackgroundColor()
{
 var colors=["crimson", "orange", "#20af0e", "teal", "indigo", "dimGray"];
 document.body.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)]
}

function Board(game)
{
 //attributes
 this.Game=game;
 this.Board=document.createElement("table");
 this.CellStates=new Array(9);

 //methods
 this.InitializeBoard=InitializeBoard;
 this.PressCell=PressCell;
}

function InitializeBoard()
{
 var board=this.Board;
 var game=this.Game;

 for (var i=0; i<3; i++)
 {
  var row=board.insertRow(-1);
  for (var j=0; j<3; j++)
  {
   var cell=row.insertCell(-1);
   cell.setAttribute("id", "Cell"+((i*3)+j));
   var this_board=this;   //required for reference; see next line
   cell.onclick=function(){this_board.PressCell(this.getAttribute("id"), 1);}

   var image=new Image();
   image.src="img/empty.png";
   cell.appendChild(image);
  }
 }
 document.getElementById("GameBoard").appendChild(board);

 this.CellStates=[0, 0, 0, 0, 0, 0, 0, 0, 0];  //numbers represent cells from left to right and from top to bottom
                                               //0 represents empty cell; 1 represents human's mark; -1 represents computer's mark
}

function PressCell(cell_id, cell_state)
{
 var cell_address=Math.floor(cell_id.substring(4, cell_id.length));
 var cell_states=this.CellStates;
 var game=this.Game;

 if (cell_states[cell_address]==0 && game.GameOver==false)
 { 
  //if cell is currently empty and game is not over
  cell_states[cell_address]=cell_state;
   
  var cell=document.getElementById(cell_id);
  var image=cell.querySelector("img");
  image.src=(cell_state==1)?"img/x.png":"img/o.png";

  if (game.ComputerMove==false){game.ComputerMove=true; game.ExecuteComputerMove();}  //next is computer's turn
  else {game.ComputerMove=false;}                                                     //next is human's turn
 }
}


function Game()
{
 //attributes
 this.Board=new Board(this);                    
 this.ComputerMove=false;                       
 this.GameOver=false;                           
 this.Winner="D";                               //"H" means human, "C" means computer and "D" means draw.
                                                                                                
 //methods                                      
 this.InitializeGame=InitializeGame;            //creates game board
 this.SenseGameOver=SenseGameOver;              //checks if there is a winner or if it's a draw
 this.Think=Think;                              //adds cell states of cells in winning patterns to make sense of what is happening 
 this.ExecuteLogicalMove=ExecuteLogicalMove;    //AI does something to win or prevent human from winning
 this.ExecuteRandomMove=ExecuteRandomMove;      //AI executes a random move
 this.ExecuteComputerMove=ExecuteComputerMove;  //AI does something (combination of the above two methods) 
} 


function InitializeGame()
{
 this.Board.InitializeBoard();
}

function Think(integer)
{
 //returns addresses of cells whose sum of states equals the integer 
 var cell_addresses=new Array();  //2d array of cell addresses
 var cell_states=this.Board.CellStates;
  
 //checking horizontal patterns
 for (i=0; i<3; i++)
 {
  if ((cell_states[3*i]+cell_states[3*i+1]+cell_states[3*i+2])==integer)
  {
   cell_addresses.push([ (3*i), (3*i+1), (3*i+2) ]);
  }
 }

 //checking vertical patterns
 for (i=0; i<3; i++)
 {
  if ((cell_states[i]+cell_states[i+3]+cell_states[i+6])==integer)
  {
   cell_addresses.push([ i, (i+3), (i+6) ]);
  }
 }

 //checking diagonal patterns
 if ((cell_states[2]+cell_states[4]+cell_states[6])==integer)
 {
  cell_addresses.push([2, 4, 6]);
 }
 if ((cell_states[0]+cell_states[4]+cell_states[8])==integer)
 {
  cell_addresses.push([0, 4, 8]);
 }
 return cell_addresses;
}

function SenseGameOver()
{
 var game_over=this.GameOver;
 var winner=this.Winner;
 var delay=500;  //in milliseconds

 if (this.Think(3).length>=1)
 {
  game_over=true; 
  winner="H"; 
  setTimeout(function(){alert("Congratulations, you won!"); document.location.href="index.html";}, delay);
 }
 else if (this.Think(-3).length>=1)
 {
  game_over=true; 
  winner="C"; 
  setTimeout(function(){alert("Haha, I won!"); document.location.href="index.html";}, delay);
 }
 else if (this.Board.CellStates.indexOf(0)==-1)
 {
  game_over=true; 
  winner="D"; 
  setTimeout(function(){alert("Looks like it's a draw."); document.location.href="index.html";}, delay);
 }
}

function ExecuteLogicalMove(cell_addresses)
{
 var empty_cell_address;
 for (i=0; i<3; i++)
 {
  if (this.Board.CellStates[cell_addresses[i]]==0){empty_cell_address=cell_addresses[i];}
 }
 this.Board.PressCell("Cell"+empty_cell_address, -1);
}

function ExecuteRandomMove()
{
 var empty_cell_address=this.Board.CellStates.indexOf(0);
 this.Board.PressCell("Cell"+empty_cell_address, -1);
}

function ExecuteComputerMove()
{
 this.SenseGameOver();
 if (this.GameOver==false && this.ComputerMove==true)
 {
  var defend_addresses=this.Think(2);
  var play_addresses=this.Think(-2);
  if (defend_addresses.length>=1 && play_addresses.length==0){this.ExecuteLogicalMove(defend_addresses[0]);}
  else if (play_addresses.length>=1){this.ExecuteLogicalMove(play_addresses[0]);}
  else {this.ExecuteRandomMove();}
  this.ComputerMove=false;
  this.SenseGameOver();
 }
}

function Main()
{
 ChangeBackgroundColor();
 var game=new Game();
 game.InitializeGame();
}