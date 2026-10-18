# What is Monte Carlo?

## The idea: let chance do the math

Some questions are too hard to solve with a formula. What are the chances of winning a game of solitaire? How long will the line at the supermarket be? Where will a particle go after it bumps into a million atoms?

The Monte Carlo method answers questions like these in a surprising way: **don't calculate, just try**. Play the game many times at random, count what happened, and the answer appears by itself. One random try tells you almost nothing. Ten thousand random tries tell you a lot.

### An example: finding π by throwing darts

Draw a square on a wall, and draw a circle inside it that just touches its sides. Now throw darts at the square without aiming, so every dart lands at a random spot.

Some darts land inside the circle and some land outside it, in the corners. The circle takes up π/4 of the square, about 78.5%, so about 78.5% of the darts should land inside it. Count them, multiply the fraction by 4, and you get π!

With 10 darts the answer is rough. With 1,000 it is close. With a million it is very good. A computer can "throw" a million darts in less than a second, and that is the whole trick: **many random tries + counting = an answer**.

## A bit of history

### A needle on the floor (1777)

The idea is older than computers. In 1777 the French scientist **Georges-Louis Leclerc, Comte de Buffon** asked: if you drop a needle on a floor made of wooden boards, what is the chance it crosses a line between two boards? The answer has π in it. That means you can find π by dropping a needle again and again and counting, and over the years some people actually did it, thousands of times.

### Solitaire in a hospital bed (1946)

The modern method was born after World War II, at **Los Alamos**, the laboratory in the USA where the atomic bomb had been built. The mathematician **Stanislaw Ulam** was recovering from a serious illness and passed the time playing solitaire. He wondered: what is the chance that a game can be won?

He tried to work it out with combinatorics and gave up, because the number of possibilities was enormous. Then he had a much simpler idea: just play a hundred games and count how many you win. And if that works for cards, why not for the hard problems at work, like how neutrons move inside a nuclear reactor?

Ulam shared the idea with his colleague **John von Neumann**, one of the greatest mathematicians of the 20th century. Together they turned it into a real method, and in 1948 it ran on **ENIAC**, one of the first electronic computers. Since then it has become one of the most used tools in science.

## Why "Monte Carlo"?

The method needed a code name, because the work at Los Alamos was secret. **Nicholas Metropolis**, another scientist on the team, suggested **Monte Carlo**, after the famous casino in Monaco, a place where everything depends on chance: the roulette wheel, the dice, the cards.

There was also a family joke behind it. Ulam had an uncle who used to borrow money from relatives because, as he said, he "just had to go to Monte Carlo". A method that works by rolling dice deserved the name of the most famous casino in the world.

## Where is it used today?

Almost everywhere there is uncertainty:

- **Weather forecasts** run many slightly different simulations and check how many of them bring rain. That is where "a 70% chance of rain" comes from.
- **Finance** simulates thousands of possible futures for the stock market to estimate risk.
- **Movies and games** use it to compute light. Every ray of light bouncing around a scene is a random try.
- **Medicine** uses it to plan radiation treatment for cancer, by following random particles through the body.
- **Artificial intelligence** used it to beat world champions at the game of Go.

In this unit you will learn to roll the dice yourself and let Python count the results.
