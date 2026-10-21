# k-Nearest Neighbors (KNN)

**k-nearest neighbors**, or **KNN** for short, is probably the simplest machine learning model there is, and a surprisingly good one. Its whole idea fits in one old saying: *"Tell me who your friends are, and I'll tell you who you are."* To decide what a new sample is, KNN looks at the samples it already knows that are **most similar** to it, and goes with the majority.

KNN is a **supervised** model (see "Model Types"): it learns from examples that come with the right answers. It is mostly used for **classification**, picking a category, but it can predict numbers too.

## The idea

Say we know the weight and height of many cats and dogs, and we draw each one as a point. Now a new animal arrives, and we only know its weight and height. Is it a cat or a dog?

![A scatter plot of animals by weight and height. Orange circles, the cats, are small and light, at the bottom left. Blue squares, the dogs, are bigger, at the top right. A new animal, a green question mark, sits between them. A dashed circle around it holds its 3 nearest neighbors: 2 cats and 1 dog. They vote, and the answer is: it's a cat](content/images/ml_knn_idea.svg)

KNN answers in three steps:

1. **Measure the distance** from the new animal to every animal we already know.
2. **Take the k closest ones**, its "nearest neighbors". Here k = 3.
3. **Let them vote.** Two of the three neighbors are cats and one is a dog, so the answer is **cat**.

That's it. There is no formula to learn and no rule hidden inside. The data itself is the model.

## What does "close" mean?

Each sample is a list of numbers, its features, so we can think of it as a point. Two features make a point on a flat page, three make a point in space, and with more features it is a point in a space we can't draw, but the math is the same. The usual way to measure how far apart two points are is the straight-line distance, from the Pythagorean theorem:

![A grid with two points, A at 2, 1 and B at 6, 4. A dashed orange line along the bottom shows a difference of 4 in the first feature. A dashed blue line going up shows a difference of 3 in the second feature. The green straight line between A and B is the distance: the square root of 4 squared plus 3 squared, which is the square root of 25, which is 5. With more features, you add more squares](content/images/ml_knn_distance.svg)

Take the difference in every feature, square each one, add them up, and take the square root. This is called the **Euclidean distance**. Python can compute it for you with `math.dist`.

Since we compute differences, every feature has to be a **number**. A column like "color" or "city" has to be turned into numbers first.

## Choosing k

The **k** in KNN is how many neighbors get a vote. You choose it before training, so it is a **hyperparameter** (see the scikit-learn item). The choice matters, and the same animal can get different answers:

![The same animal in three panels. With k = 1, only the single nearest neighbor counts. It is an odd dog that happens to stand near the cats, so the answer is dog. With k = 3, the vote is 2 cats and 1 dog, a fair vote, and the answer is cat. With k = 9, the circle is huge and reaches the dog group, which is bigger, so the answer is dog again: the bigger group always wins. Too small a k jumps at every odd point, too big a k blurs everything. Look for the middle](content/images/ml_knn_k.svg)

- **A small k** (like 1) listens to a single neighbor. If that neighbor is unusual, or was labeled by mistake, the answer is wrong. The model is "nervous" and follows the noise in the data. This is **overfitting**.
- **A big k** looks so far away that the neighborhood stops meaning anything. In the end the biggest group in the whole dataset wins every vote. This is **underfitting**.
- The best k is somewhere in the middle, and it depends on the data. scikit-learn's default is 5, which is a fine place to start. Then try a few values and keep the one that scores best (we do exactly this in the code below).
- With two classes, pick an **odd** k (3, 5, 7...), so a vote can never end in a tie.

## Scale the columns first

KNN measures distances, so it is very sensitive to the **units** of the columns. Here is what goes wrong when we compare two flats:

![Flat A has 3 rooms and 75 square meters, flat B has 4 rooms and 100 square meters. Before scaling, the differences are 1 room and 25 square meters, and the distance is the square root of 1 squared plus 25 squared, about 25. The size makes up 99.8 percent of it and the rooms only 0.16 percent: the size decides everything. After scaling, both differences are 1, the distance is about 1.4, and each column makes up 50 percent. Both columns count the same](content/images/ml_knn_scale.svg)

The size is measured in tens of square meters, and the rooms in single rooms. So in the distance, a difference of one room is lost next to a difference of 25 square meters, and KNN practically ignores the number of rooms. If we measured the size in square centimeters instead, the problem would get even worse, although nothing about the flats changed!

The fix is to put all the columns on a similar scale before measuring distances. scikit-learn's `StandardScaler` does this: it shifts and stretches every column so that its average is 0 and its typical spread is 1. For KNN this step is almost always needed.

## KNN is a lazy learner

Most models work hard during `fit` and then answer quickly. KNN does the opposite. Its `fit` doesn't learn anything: it just **remembers** the whole training set. All the work happens in `predict`, where it measures the distance from each new sample to every sample it remembers. That's why KNN is called a **lazy learner**.

This has a price:

| Good | Not so good |
|---|---|
| Very simple to understand and to explain | Slow to predict when there is a lot of data, because it compares to every sample |
| Training is instant: it only stores the data | Keeps the whole training set in memory |
| Works with any number of classes | Needs scaled columns |
| Its answers are easy to check: just look at the neighbors | Gets worse with many features, where everything is "far" from everything |

For small and medium tabular datasets, KNN is a great first model and a good baseline to beat.

## KNN in plain Python

KNN is so simple that we can write it ourselves in a few lines, without any library. Here are some cats and dogs, by weight and height, and one odd little dog (`[8, 30]`):

```python
import math
from collections import Counter

# each animal: [weight in kg, height in cm]
animals = [[4, 25], [5, 23], [3, 22], [6, 28], [30, 60], [25, 55], [35, 65], [8, 30]]
labels  = ["cat", "cat", "cat", "cat", "dog", "dog", "dog", "dog"]

def predict(new, k):
    distances = []
    for point, label in zip(animals, labels):
        distances.append((math.dist(new, point), label))
    distances.sort()                          # closest first
    votes = [label for d, label in distances[:k]]
    print(votes)
    return Counter(votes).most_common(1)[0][0]

print(predict([7.5, 29], k=1))
print(predict([7.5, 29], k=3))
```

```
['dog']
dog
['dog', 'cat', 'cat']
cat
```

With k = 1, the odd little dog is the only one that counts. With k = 3, two cats outvote it. Exactly the story of the diagram above.

## KNN with scikit-learn

In real projects we use scikit-learn. If it isn't in your project yet, add it from the project folder:

```bash
uv add scikit-learn
```

We'll go through the whole workflow from the scikit-learn item on a real dataset: the famous **Iris** flowers. It has 150 iris flowers of 3 species, and 4 measurements of each flower: the length and width of its **sepals** (the green leaves under the flower) and of its **petals**. Our goal: measure a flower and let the model tell us its species. All the pieces below are one program, so run them one after the other in the same file.

### 1. Get the data

The dataset comes with scikit-learn:

```python
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data, iris.target

print(X.shape)
print(iris.feature_names)
print(iris.target_names)
print(X[0], y[0])
```

```
(150, 4)
['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']
['setosa' 'versicolor' 'virginica']
[5.1 3.5 1.4 0.2] 0
```

X is a table with 150 rows (flowers) and 4 columns (measurements). y holds the answers as numbers: 0, 1 or 2, which stand for the 3 species in `target_names`. The first flower is a setosa.

### 2. Split it

We hide a quarter of the flowers as a test set:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42)

print(len(X_train), "flowers to learn from,", len(X_test), "for the test")
```

```
112 flowers to learn from, 38 for the test
```

`stratify=y` keeps the same mix of species in both parts, and `random_state=42` makes the shuffle the same every time you run the program, so you get the same numbers as here.

### 3. Prepare, pick a model and train

We need two steps: scale the columns, then KNN. A **pipeline** glues them into one model, so new flowers will always be scaled exactly like the training flowers:

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
model.fit(X_train, y_train)
```

`n_neighbors` is the k. Remember that for KNN, `fit` only stores the training flowers (after scaling them).

### 4. Evaluate it

```python
print("Test accuracy:", round(model.score(X_test, y_test), 3))
```

```
Test accuracy: 0.921
```

The model got 92.1% of the test flowers right, 35 of the 38, flowers it has never seen.

### 5. Use it

Now we measure three new flowers in the garden and ask the model:

```python
# [sepal length, sepal width, petal length, petal width] in cm
new_flowers = [[5.0, 3.5, 1.4, 0.3],
               [6.0, 2.9, 4.5, 1.5],
               [6.3, 2.8, 4.9, 1.7]]

answers = model.predict(new_flowers)
print(iris.target_names[answers])
print(model.predict_proba(new_flowers))
```

```
['setosa' 'versicolor' 'virginica']
[[1.  0.  0. ]
 [0.  1.  0. ]
 [0.  0.2 0.8]]
```

`predict` gives the species. `predict_proba` shows the vote behind each answer: one row per flower, one column per species. For KNN these are simply the shares of the neighbors' votes. The first two flowers got all 5 votes. The third one was a close call: 4 neighbors said virginica and 1 said versicolor, so 0.8 and 0.2. A vote like that tells you to trust the answer a little less.

### 6. Choose k without peeking

Is 5 the best k? We must not try many values and pick the one that does best on the test set, because then the test set stops being an honest exam. Instead we use **cross-validation** on the train set only:

```python
from sklearn.model_selection import cross_val_score

for k in [1, 3, 5, 7, 9, 11, 15, 25, 51]:
    model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k))
    scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"k={k:2}  average accuracy: {scores.mean():.3f}")
```

```
k= 1  average accuracy: 0.946
k= 3  average accuracy: 0.946
k= 5  average accuracy: 0.946
k= 7  average accuracy: 0.955
k= 9  average accuracy: 0.955
k=11  average accuracy: 0.955
k=15  average accuracy: 0.946
k=25  average accuracy: 0.902
k=51  average accuracy: 0.849
```

`cross_val_score` splits the train set into 5 parts, trains 5 times, each time checking on a different part, and returns the 5 scores. You can see the story of "Choosing k" in the numbers: the middle values do best, and a k that is too big gets worse and worse. (Iris is an easy dataset, so even k = 1 does well here. On messier data, a k that is too small suffers more.)

We pick k = 7, train once more on the whole train set, and only now, once, check on the test set:

```python
model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=7))
model.fit(X_train, y_train)
print("Test accuracy:", round(model.score(X_test, y_test), 3))
```

```
Test accuracy: 0.947
```

94.7%, 36 of the 38 test flowers. Is that good? And which flowers does it confuse with which? Accuracy alone doesn't say. That is the question of the next item, "How Good Is My Model?".

### Predicting numbers

KNN can predict numbers too, with `KNeighborsRegressor` from the same module. Instead of a vote, it returns the **average** of the k neighbors' answers. For example, to guess the price of a flat, it finds the k most similar flats and averages their prices. Everything else, fit, predict, scaling and choosing k, works exactly the same.

## Summary

- **KNN** classifies a new sample by the majority vote of its **k nearest neighbors** in the training data.
- "Near" is usually the straight-line (**Euclidean**) distance, so all the features must be numbers.
- **k** is a hyperparameter: too small follows the noise, too big blurs everything. Choose it with **cross-validation**, and use an odd k for two classes.
- Always **scale** the columns first (`StandardScaler`), best inside a **pipeline**.
- KNN is a **lazy learner**: fit only stores the data, and the work happens in predict.
- In scikit-learn: `KNeighborsClassifier(n_neighbors=k)` for categories, `KNeighborsRegressor` for numbers.
