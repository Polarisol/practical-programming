# scikit-learn

**scikit-learn** is the most popular Python library for classic machine learning. It is free and open source, it started in 2007 as a student summer project, and today it is used everywhere: in schools, in universities, in startups and in giant companies. It sits on top of the libraries you already know: it works with **NumPy** arrays, it is happy to take **pandas** tables, and you draw its results with **matplotlib**.

Its strength is not one clever algorithm. It is that it puts **dozens of algorithms behind one simple, identical interface**, together with all the tools you need around them: preparing the data, splitting it, measuring the results and choosing the best settings. Once you learn to use one model in scikit-learn, you know how to use all of them.

In Python the library is called `sklearn` (short for "scikit-learn"), so that is the name you will see when we start writing code.

## Installing it

Inside your project folder, add it with uv:

```bash
uv add scikit-learn
```

uv also installs what scikit-learn needs (NumPy and SciPy) if they are not in the project yet.

## What's in the box

scikit-learn covers the three big jobs from "Model Types": supervised learning (classification and regression) and unsupervised learning (clustering and dimensionality reduction). Next to them are the tools that every model needs.

![Six cards. In orange, supervised learning: Classification, which category, for example spam or not, and Regression, which number, for example the price of a flat. In blue, unsupervised learning: Clustering, which items are alike, and Dimensionality reduction, fewer columns telling the same story. In green, tools for every model: Preprocessing, clean, fill and scale the data, and Model selection, split, compare and tune](content/images/ml_sklearn_toolbox.svg)

- **Classification**: models that pick a category, like "spam" or "not spam", or which digit is drawn. For example: nearest neighbors, decision trees, random forests, logistic regression and support vector machines.
- **Regression**: models that predict a number, like a price or a temperature. Many classification models have a regression twin, plus classics like linear regression.
- **Clustering**: models that split data into groups of similar items, like KMeans.
- **Dimensionality reduction**: squeezing many columns into a few, for example to draw the data on a 2D screen. The best known one is PCA.
- **Preprocessing**: tools that get the data ready: filling in missing values, putting all the columns on a similar scale, and turning text categories like "Haifa" or "Tel Aviv" into numbers.
- **Model selection**: tools to split the data, to measure a model fairly, and to search for its best settings.

It also comes with a few small **built-in datasets** (flowers, handwritten digits, wines, house prices) that are perfect for practice, and with functions that create made-up data.

### What it is not for

scikit-learn is built for **tabular data**: data that fits in a table with rows and columns, like a spreadsheet or a pandas DataFrame. It is not the tool for **deep learning**: big neural networks for photos, sound or long texts, like the ones behind ChatGPT or Gemini. For those people use PyTorch or TensorFlow, which can run on a graphics card (GPU). scikit-learn runs on a normal processor and is happiest with data that fits in your computer's memory. For most everyday problems, that is more than enough, and it is often the best place to start even when you plan to go bigger later.

## The data: X and y

Almost everything in scikit-learn expects the data in the same shape: a table.

![A table of flats. Each row is one flat, one sample. The blue columns, rooms, size and floor, are the features, called X. The orange column, the price, is the target, called y: the answer we want the model to learn](content/images/ml_sklearn_data.svg)

- Each **row** is one **sample**: one flat, one patient, one email, one photo.
- Each **column** is one **feature**: something we know about every sample, like its number of rooms, its size or its floor. All the feature columns together are called **X** (a capital letter, because it is a whole table).
- The column we want to predict is the **target**, or **label**, and it is called **y** (a small letter, because it is a single column). In supervised learning we have it for the training data. In unsupervised learning there is no y at all.

Features have to be **numbers**. A column like "city" has to be turned into numbers first, and that is one of the jobs of the preprocessing tools.

## One interface for every model

This is the big idea of scikit-learn. Every model is an object called an **estimator**, and every estimator has the same few methods:

![On the left, training data with X and y goes into the model with fit: step one, learn. Below it, new data with X only goes into the same model, and with predict, step two, the model gives back predictions, the answers y. Swapping the model for another one leaves the rest of the program the same](content/images/ml_sklearn_estimator.svg)

1. **Create** the model, and choose its settings.
2. **fit**: give it the training data, X and y, and it learns from them. This is the slow part, the "training".
3. **predict**: give it new samples, only X, and it returns its answers.
4. **score**: give it data where you know the answers, and it tells you how good it was.

Tools that change the data instead of predicting, like the scalers in preprocessing, have **fit** and **transform**: fit learns something about the data (like the average of each column), and transform uses it to change the data.

Because every model talks the same language, trying a different model usually means changing **one line**. Want to see if a random forest beats nearest neighbors on your data? Swap the model, run again, compare the scores. This makes experimenting fast and cheap, and it is a big reason the library is so loved.

## The workflow

Almost every machine learning project with scikit-learn goes through the same steps:

![Seven steps in a snake. 1, get the data, a table of X and y. 2, split it into a train set and a test set. 3, prepare it: clean and scale. 4, pick a model that fits the problem. 5, train it with fit on the train set. 6, evaluate it: score it on the test set. If it is not good enough, go back and try again. 7, use it to predict new data](content/images/ml_sklearn_workflow.svg)

1. **Get the data.** Load it from a file, a database or one of the built-in datasets, and arrange it as X and y. Look at it before anything else: how many rows, which columns, are there missing values?
2. **Split it** into a train set and a test set (more on this below).
3. **Prepare it.** Fill in or remove missing values, turn text categories into numbers, and put the columns on a similar scale. Some models care a lot about scale: if "size" is in the hundreds and "rooms" is between 1 and 6, a model that measures distances will think size is far more important.
4. **Pick a model** that fits the problem. A category or a number? Labels or no labels? How much data do you have? Start simple.
5. **Train it**: call fit on the train set.
6. **Evaluate it**: predict the test set and compare to the real answers. For classification, use the measures from the next item, "How Good Is My Model?". If the result is not good enough, go back: prepare the data differently, try other settings, or try another model.
7. **Use it**: predict answers for new data the model has never seen. That is the whole point.

### Why split the data?

![A row of 20 boxes, one for each row of the table. 16 orange boxes, 80 percent, are the train set: the model learns from these. 4 blue boxes, 20 percent, are the test set: the exam, hidden until the end. The rows are shuffled first, then cut](content/images/ml_sklearn_split.svg)

Think of a student who gets the exam questions in advance. They can memorize every answer and get 100, without understanding anything. A model can do the same: it can **memorize** the training data instead of learning the rule behind it. This is called **overfitting**, and a model that overfits looks perfect on data it has seen and fails on new data.

So before training, we hide part of the data, usually 20% to 25%, as a **test set**. The model never sees it during training. At the end we test on it, and the score tells us how the model will do in the real world, on data it has never met. scikit-learn has a ready-made function that shuffles the rows and cuts them for you.

The golden rule: **the test set is only for the final check.** If you keep tweaking the model until the test score looks good, the test set has quietly become part of the training, and the score is no longer honest.

### Settings and fine-tuning

Every model has settings that **you** choose before training, like how many neighbors to look at, or how deep a decision tree may grow. These are called **hyperparameters**, to tell them apart from the **parameters** the model learns by itself during fit. Picking good hyperparameters can make a big difference.

How do you choose them without peeking at the test set? scikit-learn's answer is **cross-validation**: it splits the train set itself into, say, 5 parts, trains 5 times, each time holding out a different part to check on, and averages the 5 scores. There are also tools that try many combinations of settings this way and report the best one, all automatically.

### Pipelines

A real project chains several steps: fill the missing values, then scale, then the model. scikit-learn can glue these steps into a single object called a **pipeline**. The pipeline itself behaves like one model, with the same fit and predict. This keeps the code short, makes sure new data goes through exactly the same preparation as the training data, and prevents a sneaky mistake: preparing the data using information from the test set.

## Choosing a model

With so many models, where do you start? A few rules of thumb:

| Your problem | Good first models |
|---|---|
| Classification, small data | Nearest neighbors, logistic regression, decision tree |
| Classification, more data | Random forest, gradient boosting |
| Regression | Linear regression, random forest |
| Clustering | KMeans |
| Too many columns | PCA |

Start with something **simple** and get a baseline score. Only then try something fancier, and keep it only if the score really gets better. The scikit-learn website even has a famous flowchart, [Choosing the right estimator](https://scikit-learn.org/stable/machine_learning_map.html), that walks you to a model by answering a few questions about your data.

## Summary

- scikit-learn is the standard Python library for classic machine learning on **tabular data**. Add it to a project with `uv add scikit-learn`.
- It has models for **classification, regression, clustering and dimensionality reduction**, plus tools for **preparing data** and **choosing models**.
- The data is a table: **X** holds the features (one row per sample), and **y** holds the answers.
- Every model has the same methods: **fit** to learn, **predict** to answer, **score** to check. Swapping models is one line.
- The workflow: get the data, **split** it, prepare it, pick a model, fit, **evaluate on the test set**, improve, and use.
- For deep learning on images, sound and long texts, other libraries take over. For almost everything else, scikit-learn is the place to start.

Later on we will write scikit-learn code ourselves, step by step.
