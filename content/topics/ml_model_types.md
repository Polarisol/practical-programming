# Model Types

A machine learning model is a program that learns from data instead of following rules we wrote by hand. Nobody writes `if ears_are_pointy and weight < 6: return "cat"`. We show the program a lot of data, and it finds the rules by itself.

But "learning from data" can mean very different things. The big question is: **what does the data tell the model?** Does every example come with the right answer? Does nothing come with an answer? Or does the model only find out afterwards whether what it did was good or bad? The answer splits machine learning into three main families:

1. **Supervised learning**: learn from examples that come with answers.
2. **Unsupervised learning**: find structure in data that has no answers.
3. **Reinforcement learning**: learn by trial and error, from rewards and punishments.

## Supervised learning

In **supervised learning** every training example comes with a **label**: the correct answer. It is like studying with a teacher who has the answer key. We show the model thousands of photos, each one marked "cat" or "dog", and it learns what separates them. Then we give it a new photo it has never seen, and it predicts the label.

![Two panels. On the left, the training data: orange circles labeled cat and blue squares labeled dog, with a dashed line the model learned between them. On the right, a new point marked with a question mark falls on the cat side of the line, so the model says: cat](content/images/ml_types_supervised.svg)

The examples are called the **inputs** (often `X`) and the answers are the **labels** or **targets** (often `y`). The model learns a function that takes `X` and returns `y`.

Supervised problems come in two kinds:

- **Classification**: the answer is a category. Cat or dog? Spam or not spam? Which digit is drawn here? Is this tumor benign or malignant?
- **Regression**: the answer is a number. What will this apartment sell for? How many ice creams will we sell tomorrow? How long will this trip take?

**What it is used for:** spam filters, face recognition in your phone's gallery, reading handwritten digits (try the simulation on this page, it is a supervised model), medical diagnosis from scans, credit card fraud detection, price prediction, translation and speech-to-text.

**What it can do, and what it needs:** supervised learning is the most common and usually the most accurate kind of machine learning, because the model knows exactly what it is aiming for. And since we have the right answers, we can measure how good the model is (see the next item, "How Good Is My Model?"). The catch is that it needs **a lot of labeled data**, and labels are expensive: someone has to sit and mark thousands of photos, or a doctor has to diagnose thousands of scans. The model is also only as good as its labels. If the labels are wrong or biased, the model learns the mistakes too.

### A taste in Python

Here is a tiny classifier with **scikit-learn** (`uv add scikit-learn`). Each animal is described by its weight and height, and we give the model the answers:

```python
from sklearn.neighbors import KNeighborsClassifier

# each animal: [weight in kg, height in cm]
X = [[4, 25], [5, 23], [3, 22], [30, 60], [25, 55], [35, 65]]
y = ["cat", "cat", "cat", "dog", "dog", "dog"]   # the answers

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X, y)                     # learn from examples AND answers

print(model.predict([[6, 26], [28, 58]]))
```

```
['cat' 'dog']
```

Notice `fit(X, y)`: the model gets both the examples and the answers.

## Unsupervised learning

In **unsupervised learning** there are **no labels** at all. We hand the model a pile of data and ask: "what can you find in here?" There is no teacher and no answer key. The model looks for patterns, groups and structure by itself.

![Two panels. On the left, gray points with no labels, sitting in three loose clouds. On the right, the same points colored in three colors, each cloud circled and named group 1, group 2 and group 3. Nobody told the model what the groups are](content/images/ml_types_unsupervised.svg)

The most common unsupervised tasks are:

- **Clustering**: split the data into groups of similar items. An online shop can split its customers into groups by how they buy, without knowing in advance what the groups are.
- **Anomaly detection**: learn what "normal" looks like, and flag anything that doesn't fit. A strange login at 3 AM from another country, or a machine in a factory that starts to vibrate differently.
- **Dimensionality reduction**: squeeze data with many columns into a few, while keeping what matters. This helps to draw high dimensional data on a 2D screen, or to speed up other models.

**What it is used for:** customer segmentation for marketing, grouping news stories about the same event, recommending products ("people who bought this also bought..."), finding fraud and cyber attacks, compressing images, and exploring a new dataset before you know what to ask about it.

**What it can do, and what it can't:** its big advantage is that it works on **raw data**, and raw data is cheap and everywhere. It can discover patterns nobody thought to look for. But the model doesn't know what the groups **mean**. It will tell you "these 500 customers are similar", and a person has to look at them and decide that this is "students who shop at night". It is also harder to judge: with no right answers, there is no simple score that says whether the grouping is "correct".

### A taste in Python

Here we give **KMeans** 9 customers and ask it to find 3 groups. Notice that there is no `y`:

```python
from sklearn.cluster import KMeans

# customers: [visits per month, money spent per visit]
X = [[1, 20], [2, 25], [1, 22],      # come rarely, spend a little
     [9, 25], [10, 20], [8, 22],     # come often, spend a little
     [2, 90], [1, 95], [3, 100]]     # come rarely, spend a lot

model = KMeans(n_clusters=3, n_init=10, random_state=0)
model.fit(X)                        # learn from the examples only: no y!

print(model.labels_)
```

```
[2 2 2 0 0 0 1 1 1]
```

The model put every customer in a group (0, 1 or 2) and found exactly the three kinds we had in mind. The group numbers themselves mean nothing. Naming them is our job.

## Reinforcement learning

In **reinforcement learning** (RL) there is no dataset of examples at all. Instead there is an **agent** (the learner) that lives in an **environment** (a game, a simulation, the real world). The agent takes an **action**, the environment changes, and the agent gets a **reward**: a number that says how good that was. A positive reward is like a treat, a negative one is like a punishment.

![A loop between two boxes. The Agent, the learner, sends an action to the Environment, the game or the world. The Environment sends back a reward, plus or minus, and a new situation. The agent repeats this loop many times and learns which actions bring the most reward](content/images/ml_types_reinforcement.svg)

The agent repeats this loop thousands or millions of times. At first it acts almost randomly. Slowly it learns a **policy**: which action to take in each situation so that the **total reward over time** is as large as possible. This is just how you teach a dog a trick, or how you learned to ride a bicycle: nobody gave you a table of correct answers, you tried, fell, and adjusted.

Two ideas make RL special:

- **Delayed reward**: in chess, you only find out at the end if you won. The agent has to figure out which of its 40 moves earned the win.
- **Exploration vs. exploitation**: should the agent do what worked so far (exploit), or try something new that might be even better (explore)? Too little exploring and it gets stuck on a "good enough" strategy. Too much and it never uses what it learned.

**What it is used for:** playing games (AlphaGo beat the world champion at Go, and RL agents play Atari and StarCraft at a superhuman level), teaching robots to walk and grab things, self-driving car decisions, controlling the cooling of data centers to save energy, and fine-tuning chatbots like ChatGPT, Gemini and Claude with human feedback (RLHF), so their answers are more helpful.

**What it can do, and what it needs:** RL can solve problems where nobody knows the right answer in advance, and it can find strategies that surprise even experts. But it needs **a huge number of tries**, which is why it is usually trained in a simulation, not on a real robot that might break. It is also very sensitive to how the reward is defined: an agent will happily find a "loophole" that collects reward without doing what we actually wanted.

### A taste in Python

No library needed for this one. An agent stands in front of 3 slot machines. It doesn't know that they pay 20%, 50% and 80% of the time. It has 1,000 tries to figure out which one is best. Most of the time it picks the best machine so far (exploit), and 10% of the time it picks a random one (explore):

```python
import random

chances = [0.2, 0.5, 0.8]   # hidden from the agent: how often each machine pays
value = [0.0, 0.0, 0.0]     # what the agent believes each machine is worth
tries = [0, 0, 0]

for step in range(1000):
    if random.random() < 0.1:               # explore: try something random
        action = random.randrange(3)
    else:                                   # exploit: pick the best so far
        action = value.index(max(value))
    reward = 1 if random.random() < chances[action] else 0
    tries[action] += 1
    value[action] += (reward - value[action]) / tries[action]

print("tries:", tries)
print("learned values:", [round(v, 2) for v in value])
```

```
tries: [36, 76, 888]
learned values: [0.19, 0.5, 0.78]
```

Your numbers will be a little different every run, but the agent always ends up spending almost all of its tries on the best machine, and its guesses of how often each one pays are close to the truth. Nobody told it the answer: it learned from rewards alone.

## Summary

| | Supervised | Unsupervised | Reinforcement |
|---|---|---|---|
| What the model gets | Examples **with** answers | Examples **without** answers | Rewards for its actions |
| What it learns | To predict the answer for new examples | Groups and patterns in the data | Which action to take in each situation |
| Typical tasks | Classification, regression | Clustering, anomaly detection | Games, robots, control |
| Example | Is this email spam? | Which customers are alike? | How to win at chess? |
| Main cost | Labeling a lot of data | Making sense of what it found | Very many tries, a good reward |

- Ask first: **do I have the right answers for my data?** If yes, it is probably a supervised problem. If not, unsupervised. If the "data" is the result of the model's own actions, it is reinforcement learning.
- Real systems often mix them. A chatbot first learns from huge amounts of unlabeled text, then from examples of good answers, and finally from rewards given by people.
