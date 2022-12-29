# Catch
This repository implements the Catch board game. It is a strategy game for two players. Each player will be represented by a color. The first player must fill two spaces vertically and the second, two spaces horizontally, alternately.

## Rules
When the first player clicks on a square, this one and the square below to it is filled with the color blue. When the second player clicks on a square, this one and the square right to it is filled with the color red. When an area containing 1, 2, or 3 squares is fenced off, they will be marked with an `X' in the current player's color and the score is updated.

## Game Over
If the current player can not make a move, it loses the game. If there are no empty spaces, the player with the highest score wins. If both players have the same score, the game is a draw.
