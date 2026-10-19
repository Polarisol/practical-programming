# Bayes: Updating Beliefs with Evidence

You hear a strange noise downstairs at night. Is it a burglar? Probably not: burglars are rare, and old houses make noises all the time. But if you also hear glass breaking, you change your mind fast.

That is what **Bayes' rule** is about: **you start with a belief, you see some evidence, and you update the belief**. It is one of the most useful ideas in statistics, and it is behind spam filters, medical diagnosis, search engines and a lot of machine learning.

## Conditional probability

First, some notation. **P(A)** is the probability of A. **P(A | B)** is the probability of A **given that** B happened. The `|` reads "given".

- P(rain) is the chance of rain on a random day, maybe 10%.
- P(rain | cloudy) is the chance of rain on a day we **already know** is cloudy, which is higher.

The big trap: **P(A | B) is not the same as P(B | A)**. Almost every dog has four legs, so P(four legs | dog) is close to 100%. But P(dog | four legs) is much lower, because cats, horses and tables have four legs too. Bayes' rule is the tool that turns one into the other.

## An example: a medical test

A disease affects **1%** of people. There is a test for it:

- If you are sick, the test is positive **90%** of the time.
- If you are healthy, the test is still positive **10%** of the time (a "false alarm").

You take the test and it comes out **positive**. What is the chance you are really sick?

Most people guess about 90%. Let's check. The easiest way is to stop thinking about percentages and **imagine 1,000 people**:

![A tree of 1,000 people. 10 are sick and 990 are healthy. Of the 10 sick, 9 test positive and 1 tests negative. Of the 990 healthy, 99 test positive and 891 test negative. 108 people test positive, and only 9 of them are sick: about 8.3%](content/images/bayes_tree.svg)

- 1% of 1,000 are sick: **10 people**. The test catches 90% of them: **9 positives**.
- 990 are healthy. The test gives a false alarm for 10% of them: **99 positives**.

So 9 + 99 = **108** people get a positive result, and only **9** of them are really sick:

![108 dots for everyone who tested positive. Only 9 of them are red (sick). The other 99 are orange (healthy people with a false alarm). The chance of being sick given a positive test is 9 / 108, about 8.3%](content/images/bayes_positives.svg)

The answer is about **8.3%**, not 90%! The test is good, but the disease is so rare that the false alarms from the many healthy people outnumber the real cases. Ignoring how rare something is to begin with is called the **base rate fallacy**, and even doctors fall for it.

## Bayes' rule

The same calculation, written as a formula:

![Bayes' rule: P(A given B) equals P(B given A) times P(A), divided by P(B). P(A given B) is the posterior, P(B given A) is the likelihood, P(A) is the prior and P(B) is the evidence](content/images/bayes_formula.svg)

```math
P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}
```

Each part has a name:

| Part | Name | In our example |
|------|------|----------------|
| P(A) | **Prior**: what we believed before the evidence | P(sick) = 0.01 |
| P(B \| A) | **Likelihood**: how likely the evidence is if A is true | P(positive \| sick) = 0.9 |
| P(B) | **Evidence**: how likely the evidence is overall | P(positive) = 108 / 1000 = 0.108 |
| P(A \| B) | **Posterior**: what we believe after the evidence | P(sick \| positive) = ? |

P(B) is usually the hardest part. We find it by adding up **every way** the evidence can happen. Here, a positive test comes either from a sick person or from a healthy one:

```math
P(B) = P(B \mid A) \cdot P(A) + P(B \mid \text{not } A) \cdot P(\text{not } A)
```

P(positive) = 0.9 × 0.01 + 0.1 × 0.99 = 0.009 + 0.099 = 0.108

And now: P(sick | positive) = 0.9 × 0.01 / 0.108 = 0.009 / 0.108 ≈ **0.083**, the same 8.3% we got by counting people.

## Updating again and again

What if you take the test a **second** time and it is positive again? Now you are not a random person anymore. Your starting point is the answer from the first test: the **posterior becomes the new prior**.

![A bar chart. Before any test the chance of being sick is 1%. After one positive test it is 8.3%, after two it is 45%, and after three it is 88%](content/images/bayes_updates.svg)

Each positive result pushes the belief up, and three in a row make it very likely. This is how Bayesian thinking works in real life too: one surprising piece of evidence should move your opinion a little, and a lot of evidence should move it a lot.

## Another example: a spam filter

Early spam filters used Bayes' rule on the words in an email. Say:

- 20% of all emails are spam: P(spam) = 0.2
- The word "winner" appears in 40% of spam emails: P(winner | spam) = 0.4
- It appears in only 1% of normal emails: P(winner | normal) = 0.01

An email says "winner". Is it spam?

- P(winner) = 0.4 × 0.2 + 0.01 × 0.8 = 0.08 + 0.008 = 0.088
- P(spam | winner) = 0.4 × 0.2 / 0.088 ≈ **0.91**

About 91%: straight to the spam folder. A real filter does this for many words at once.

## A bit of history

**Thomas Bayes** (around 1701-1761) was an English minister who loved mathematics. He never published his idea. After his death, his friend **Richard Price** found it in his papers and published it in 1763. A few years later the French mathematician **Pierre-Simon Laplace** discovered the same rule on his own and turned it into a powerful tool, using it for everything from astronomy to population counts.

## In Python

A function for Bayes' rule with a yes/no question:

```python
def bayes(prior, p_evidence_if_true, p_evidence_if_false):
    evidence = p_evidence_if_true * prior + p_evidence_if_false * (1 - prior)
    return p_evidence_if_true * prior / evidence

p = bayes(0.01, 0.9, 0.1)
print(round(p, 3))  # 0.083

# Test again: yesterday's posterior is today's prior
for test in range(2, 4):
    p = bayes(p, 0.9, 0.1)
    print(test, "positives:", round(p, 3))
# 2 positives: 0.45
# 3 positives: 0.88
```

Don't trust the formula? Check it with a **Monte Carlo** simulation, as in the previous unit: create a million random people and count.

```python
import numpy as np

n = 1_000_000
sick = np.random.rand(n) < 0.01                  # 1% are sick
r = np.random.rand(n)
positive = np.where(sick, r < 0.9, r < 0.1)      # 90% caught, 10% false alarms

print(sick[positive].mean())  # about 0.083
```

`sick[positive]` keeps only the people who tested positive, and `.mean()` of True/False values is the fraction that are True.

### Try it

1. A better test gives false alarms only 1% of the time. What is P(sick | positive) now?
2. Change the simulation so the disease affects 10% of people. How does the answer change, and why?
