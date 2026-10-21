# How Good Is My Model?

You trained a model that looks at a photo and says "cat" or "dog". How do you know if it is any good? The obvious answer is "count how often it is right". That is a start, but it hides a lot: **which** mistakes does the model make? Does it miss cats, or does it call dogs cats? In many real problems these two mistakes cost very different things.

A **confusion matrix** answers this. It is a small table that sorts every prediction into one of four boxes, and from those four numbers we get the measures everyone uses to judge a classifier: **accuracy**, **precision**, **recall** and **F1-score**.

## The confusion matrix

A confusion matrix sums up how a classification algorithm did. It is most common for **binary classification** (two classes), but it works for any number of classes too.

In binary classification we call one class **positive** and the other **negative**. "Positive" doesn't mean "good". It is just the class we are looking for: a cat, a sick patient, a spam email, a fraud. The matrix then has 4 boxes:

![A 2 by 2 table. The rows are what is really true (positive or negative) and the columns are what the model said. True Positive and True Negative, on the diagonal, are green: the model was right. False Negative and False Positive are red: the model was wrong](content/images/ml_confusion_matrix.svg)

1. **True Positive (TP)**: examples we predicted as positive, and they really are positive.
2. **False Positive (FP)**: examples we predicted as positive, but they are really negative. Also called a **Type I error**, or a false alarm.
3. **False Negative (FN)**: examples we predicted as negative, but they are really positive. Also called a **Type II error**, or a miss.
4. **True Negative (TN)**: examples we predicted as negative, and they really are negative.

An easy way to remember the names: the second word (Positive / Negative) is **what the model said**, and the first word (True / False) is **whether it was right**.

The confusion matrix lets us compute several measures, and each one describes the model's quality from a different angle.

## Accuracy

**Accuracy** is the share of correct predictions (correct positives + correct negatives) out of all the examples.

```math
\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}
```

The higher it is, the more often the model is right. But accuracy can be misleading when the classes are **unbalanced**, for example when there are many more negative examples than positive ones.

Imagine 1,000 patients, and only 10 of them are sick. A lazy "model" that always says "healthy" gets 990 right: **99% accuracy**! And yet it never found a single sick person. That is why we need the next measures.

## Precision

**Precision** asks: out of all the examples we **predicted as positive**, how many are really positive?

```math
\text{Precision} = \frac{TP}{TP + FP}
```

High precision means few false positives (low FP): when the model says "positive", you can trust it. In other words, the model does not label many negatives as positive by mistake. We hardly "accuse the innocent".

Precision matters most when a false alarm is expensive. A spam filter needs high precision: sending an important email to the spam folder is worse than letting one spam message through.

## Recall

**Recall** (sometimes called **sensitivity**) asks: out of all the examples that **really are positive**, how many did we find?

```math
\text{Recall} = \frac{TP}{TP + FN}
```

High recall means few false negatives (low FN): the model hardly misses positive examples.

Recall matters most when a miss is expensive. A test for a serious disease needs high recall: sending a sick person home is much worse than asking a healthy person to do another test.

**Precision and recall pull in opposite directions.** A model that says "positive" about everything has a perfect recall (it misses nothing) and a terrible precision. A model that says "positive" only when it is 100% sure has a great precision and a poor recall. Choosing between them depends on which mistake costs more.

## F1-score

The **F1-score** is the harmonic mean of precision and recall, so it gives one number that balances the two.

```math
F1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}
```

Why the harmonic mean and not a regular average? Because it punishes a low value. A model with precision 1.0 and recall 0.0 has a regular average of 0.5, but an F1 of **0**. To get a high F1 both have to be high.

F1 is especially useful when we need to balance between "accusing" a negative example and missing a positive one, and it is more sensitive than accuracy to cases of unbalanced classes.

## A simple example

We have 10 animals: 4 cats and 6 dogs. We use a model that tries to predict whether an animal is a "cat" (positive) or a "dog" (negative). Say the model made these predictions:

- Of the 4 cats, 3 were correctly identified as cats (TP = 3), and 1 cat was wrongly identified as a dog (FN = 1).
- Of the 6 dogs, 2 were wrongly identified as cats (FP = 2), and 4 were correctly identified as dogs (TN = 4).

Now let's build the confusion matrix:

![The confusion matrix of the cat and dog model. Actually a cat: TP = 3 cats found, FN = 1 cat missed. Actually a dog: FP = 2 dogs called cats, TN = 4 dogs found. Correct: 7 of 10, mistakes: 3](content/images/ml_confusion_cats_dogs.svg)

And the measures:

- **Accuracy** = (TP + TN) / (TP + TN + FP + FN) = (3 + 4) / (3 + 4 + 2 + 1) = 7 / 10 = **70%**
- **Precision** = TP / (TP + FP) = 3 / (3 + 2) = 3 / 5 = **60%**
- **Recall** = TP / (TP + FN) = 3 / (3 + 1) = 3 / 4 = **75%**
- **F1-score** = 2 × (Precision × Recall) / (Precision + Recall) = 2 × (0.6 × 0.75) / (0.6 + 0.75) = 0.9 / 1.35 ≈ 0.67 = **67%**

This example shows how each measure gives a different view of the model:

- **Accuracy** looks at all the predictions: the model was right about 7 of the 10 animals.
- **Precision** looks at the positive predictions: of the 5 animals the model called "cat", only 3 really were cats.
- **Recall** looks at the ability to "catch" all the cats: the model found 3 of the 4 cats.
- **F1** is the balance between precision and recall.

## Computing it in Python

The counting is simple enough to do yourself. Here are the real labels and the model's predictions for the 10 animals:

```python
actual    = ["cat", "cat", "cat", "cat", "dog", "dog", "dog", "dog", "dog", "dog"]
predicted = ["cat", "cat", "cat", "dog", "cat", "cat", "dog", "dog", "dog", "dog"]

positive = "cat"
tp = fp = fn = tn = 0
for a, p in zip(actual, predicted):
    if p == positive and a == positive:
        tp += 1
    elif p == positive:
        fp += 1
    elif a == positive:
        fn += 1
    else:
        tn += 1

accuracy = (tp + tn) / len(actual)
precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * precision * recall / (precision + recall)

print(f"TP={tp} FP={fp} FN={fn} TN={tn}")
print(f"Accuracy:  {accuracy:.0%}")
print(f"Precision: {precision:.0%}")
print(f"Recall:    {recall:.0%}")
print(f"F1-score:  {f1:.0%}")
```

```
TP=3 FP=2 FN=1 TN=4
Accuracy:  70%
Precision: 60%
Recall:    75%
F1-score:  67%
```

In real projects you will usually let the **scikit-learn** library do it (`uv add scikit-learn`). `confusion_matrix` builds the table and `classification_report` prints precision, recall and F1 for every class:

```python
from sklearn.metrics import confusion_matrix, classification_report

print(confusion_matrix(actual, predicted, labels=["cat", "dog"]))
print(classification_report(actual, predicted))
```

## Summary

| Measure | Question it answers | Formula |
|---------|---------------------|---------|
| Accuracy | How often is the model right? | (TP + TN) / all |
| Precision | When it says "positive", is it right? | TP / (TP + FP) |
| Recall | Of all the real positives, how many did it find? | TP / (TP + FN) |
| F1-score | One number that balances precision and recall | 2 × P × R / (P + R) |

- Never trust accuracy alone, especially when one class is much rarer than the other.
- Ask which mistake is worse for **your** problem: a false alarm (watch precision) or a miss (watch recall).
